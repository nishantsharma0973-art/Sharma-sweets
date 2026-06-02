from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hmac
import hashlib
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

try:
    import razorpay  # type: ignore
except Exception:  # pragma: no cover
    razorpay = None

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ["DB_NAME"]]

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")
RAZORPAY_ENABLED = bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET and razorpay)
rz_client = (
    razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    if RAZORPAY_ENABLED
    else None
)

app = FastAPI(title="Sharma Sweets API")
api = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ----------------------- Models -----------------------
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    price: float  # in INR
    image: str
    badge: Optional[str] = None
    sugar_free: bool = False
    rating: float = 4.7
    created_at: str = Field(default_factory=now_iso)


class CartItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None


class OrderCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    pincode: str
    notes: Optional[str] = ""
    items: List[CartItem]


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    email: str
    phone: str
    address: str
    city: str
    pincode: str
    notes: str = ""
    items: List[CartItem]
    subtotal: float
    delivery_fee: float
    total: float
    status: str = "pending"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    payment_status: str = "pending"
    created_at: str = Field(default_factory=now_iso)


class PaymentVerify(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    rating: int = 5
    text: str
    location: Optional[str] = ""
    created_at: str = Field(default_factory=now_iso)


class TestimonialCreate(BaseModel):
    name: str
    rating: int = 5
    text: str
    location: Optional[str] = ""


class NewsletterIn(BaseModel):
    email: EmailStr


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str


class CateringInquiry(BaseModel):
    name: str
    email: EmailStr
    phone: str
    event_type: str
    event_date: Optional[str] = ""
    guest_count: Optional[int] = 0
    message: Optional[str] = ""


# ----------------------- Seed data -----------------------
SEED_PRODUCTS: List[dict] = [
    # Bengali Sweets
    {"name": "Rasgulla", "category": "Bengali Sweets", "description": "Spongy cottage cheese balls soaked in delicate rose-cardamom syrup.", "price": 480, "image": "https://images.unsplash.com/photo-1605194000384-439c3ced8d15?auto=format&fit=crop&w=900&q=80", "badge": "Bestseller"},
    {"name": "Sandesh", "category": "Bengali Sweets", "description": "Hand-moulded chenna delicacy infused with saffron and pistachio.", "price": 560, "image": "https://images.unsplash.com/photo-1695568181363-af5c78f4d059?auto=format&fit=crop&w=900&q=80"},
    {"name": "Cham Cham", "category": "Bengali Sweets", "description": "Oval chenna sweet rolled in coconut, soaked in mild saffron syrup.", "price": 540, "image": "https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?auto=format&fit=crop&w=900&q=80"},
    # Dry Fruit Sweets
    {"name": "Kaju Katli", "category": "Dry Fruit Sweets", "description": "Wafer-thin diamond cashew fudge with edible silver leaf.", "price": 980, "image": "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=900&q=80", "badge": "Premium"},
    {"name": "Anjeer Barfi", "category": "Dry Fruit Sweets", "description": "Slow-cooked figs with almonds and pistachios. Naturally sweet.", "price": 1100, "image": "https://images.unsplash.com/photo-1601566892091-7a4b3a5b6f44?auto=format&fit=crop&w=900&q=80"},
    {"name": "Pista Roll", "category": "Dry Fruit Sweets", "description": "Soft pistachio centre wrapped in delicate khoya, dusted in gold.", "price": 1240, "image": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=900&q=80"},
    # Milk Sweets
    {"name": "Gulab Jamun", "category": "Milk Sweets", "description": "Warm khoya dumplings glazed in cardamom-rose syrup.", "price": 420, "image": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80", "badge": "Bestseller"},
    {"name": "Milk Cake", "category": "Milk Sweets", "description": "Grainy, caramelised milk fudge — Alwar's pride.", "price": 520, "image": "https://images.unsplash.com/photo-1644242379312-fbb46ef93f97?auto=format&fit=crop&w=900&q=80"},
    {"name": "Peda", "category": "Milk Sweets", "description": "Hand-rolled khoya peda finished with saffron threads.", "price": 460, "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"},
    # Sugar Free
    {"name": "Sugar-Free Kaju Roll", "category": "Sugar-Free Sweets", "description": "Cashew rolls sweetened naturally with date paste.", "price": 1180, "image": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80", "sugar_free": True, "badge": "Sugar-Free"},
    {"name": "Sugar-Free Dry Fruit Laddoo", "category": "Sugar-Free Sweets", "description": "Almonds, pistachios, walnuts bound with figs and dates.", "price": 1320, "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80", "sugar_free": True},
    # Namkeen
    {"name": "Bikaneri Bhujia", "category": "Namkeen & Snacks", "description": "Crisp besan vermicelli laced with green chilli and ajwain.", "price": 260, "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80"},
    {"name": "Masala Cashews", "category": "Namkeen & Snacks", "description": "Roasted cashews tossed in our house masala blend.", "price": 740, "image": "https://images.unsplash.com/photo-1599909533730-d65bff8eb8e6?auto=format&fit=crop&w=900&q=80"},
    {"name": "Mathri", "category": "Namkeen & Snacks", "description": "Flaky North Indian crackers, perfect with masala chai.", "price": 220, "image": "https://images.unsplash.com/photo-1606491048802-8342506d6471?auto=format&fit=crop&w=900&q=80"},
    # Gift Boxes
    {"name": "Royal Diwali Hamper", "category": "Festival Gift Boxes", "description": "Hand-crafted wooden box with 8 premium varieties + diyas.", "price": 2850, "image": "https://images.pexels.com/photos/32044781/pexels-photo-32044781.jpeg?auto=compress&cs=tinysrgb&w=900", "badge": "Festival"},
    {"name": "Rakhi Celebration Box", "category": "Festival Gift Boxes", "description": "Sister's love hamper: kaju katli, peda, dry fruits + rakhi.", "price": 1680, "image": "https://images.unsplash.com/photo-1612392061787-2d078b3e573b?auto=format&fit=crop&w=900&q=80"},
    {"name": "Wedding Shagun Box", "category": "Festival Gift Boxes", "description": "Elegant gold-embossed box, customisable assortment.", "price": 3450, "image": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80", "badge": "Premium"},
]

SEED_TESTIMONIALS: List[dict] = [
    {"name": "Priya Agarwal", "rating": 5, "location": "Jaipur", "text": "The Kaju Katli melts like silk. Sharma Sweets has been our family's Diwali tradition for years."},
    {"name": "Rohit Mehta", "rating": 5, "location": "Dausa", "text": "Ordered the Wedding Shagun box for my sister's engagement — every guest asked where it was from."},
    {"name": "Ananya Sharma", "rating": 5, "location": "Delhi", "text": "Sugar-free range is a blessing for my dad. Tastes like the original. Hygiene is top-notch."},
    {"name": "Karan Singhania", "rating": 5, "location": "Gurugram", "text": "Corporate gifting partner for 3 years. Always on time, always premium."},
    {"name": "Meera Iyer", "rating": 5, "location": "Mumbai", "text": "The Bengali Rasgullas are unbelievably soft. Packaging is gift-ready every single time."},
    {"name": "Vikram Joshi", "rating": 5, "location": "Udaipur", "text": "Catered our Holi celebration with 200 guests. Flawless execution, every sweet was fresh."},
]


@app.on_event("startup")
async def seed_db():
    if await db.products.count_documents({}) == 0:
        products = [Product(**p).model_dump() for p in SEED_PRODUCTS]
        await db.products.insert_many(products)
        logging.info(f"Seeded {len(products)} products")
    if await db.testimonials.count_documents({}) == 0:
        testimonials = [Testimonial(**t).model_dump() for t in SEED_TESTIMONIALS]
        await db.testimonials.insert_many(testimonials)
        logging.info(f"Seeded {len(testimonials)} testimonials")


# ----------------------- Routes -----------------------
@api.get("/")
async def root():
    return {"message": "Sharma Sweets API", "razorpay_enabled": RAZORPAY_ENABLED}


@api.get("/config")
async def get_config():
    return {
        "razorpay_enabled": RAZORPAY_ENABLED,
        "razorpay_key_id": RAZORPAY_KEY_ID if RAZORPAY_ENABLED else "",
    }


@api.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, search: Optional[str] = None):
    query: dict = {}
    if category and category.lower() != "all":
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    docs = await db.products.find(query, {"_id": 0}).to_list(500)
    return docs


@api.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


@api.get("/categories")
async def categories():
    cats = await db.products.distinct("category")
    return {"categories": sorted(cats)}


@api.post("/orders")
async def create_order(order_in: OrderCreate):
    subtotal = sum(i.price * i.quantity for i in order_in.items)
    delivery_fee = 0 if subtotal >= 999 else 79
    total = subtotal + delivery_fee
    order = Order(
        **order_in.model_dump(),
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=total,
    )
    rz_order = None
    if RAZORPAY_ENABLED:
        try:
            rz_order = rz_client.order.create({  # type: ignore
                "amount": int(total * 100),
                "currency": "INR",
                "receipt": order.id[:40],
                "payment_capture": 1,
            })
            order.razorpay_order_id = rz_order["id"]
        except Exception as e:
            logging.exception("Razorpay order creation failed")
            raise HTTPException(502, f"Payment gateway error: {e}")
    else:
        # Stub for demo mode — frontend will show "demo checkout"
        order.razorpay_order_id = f"demo_{order.id[:12]}"

    doc = order.model_dump()
    await db.orders.insert_one(doc)
    return {
        "order": {k: v for k, v in doc.items() if k != "_id"},
        "razorpay_order_id": order.razorpay_order_id,
        "razorpay_key_id": RAZORPAY_KEY_ID if RAZORPAY_ENABLED else "",
        "razorpay_enabled": RAZORPAY_ENABLED,
        "amount": int(total * 100),
    }


@api.post("/orders/verify-payment")
async def verify_payment(p: PaymentVerify):
    if not RAZORPAY_ENABLED:
        # Demo mode: mark as paid
        await db.orders.update_one(
            {"id": p.order_id},
            {"$set": {"payment_status": "demo_paid", "status": "confirmed",
                       "razorpay_payment_id": p.razorpay_payment_id}},
        )
        return {"verified": True, "demo": True}
    generated = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        f"{p.razorpay_order_id}|{p.razorpay_payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()
    if generated != p.razorpay_signature:
        raise HTTPException(400, "Invalid signature")
    await db.orders.update_one(
        {"id": p.order_id},
        {"$set": {
            "payment_status": "paid",
            "status": "confirmed",
            "razorpay_payment_id": p.razorpay_payment_id,
        }},
    )
    return {"verified": True}


@api.get("/orders/{order_id}")
async def get_order(order_id: str):
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Order not found")
    return doc


@api.get("/testimonials", response_model=List[Testimonial])
async def list_testimonials():
    docs = await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return docs


@api.post("/testimonials", response_model=Testimonial)
async def add_testimonial(t: TestimonialCreate):
    obj = Testimonial(**t.model_dump())
    await db.testimonials.insert_one(obj.model_dump())
    return obj


@api.post("/newsletter")
async def subscribe(n: NewsletterIn):
    existing = await db.newsletter.find_one({"email": n.email})
    if existing:
        return {"subscribed": True, "already": True}
    await db.newsletter.insert_one({"email": n.email, "created_at": now_iso()})
    return {"subscribed": True}


@api.post("/contact")
async def contact(c: ContactIn):
    doc = {**c.model_dump(), "id": str(uuid.uuid4()), "created_at": now_iso()}
    await db.contact_messages.insert_one(doc)
    return {"received": True}


@api.post("/catering")
async def catering(c: CateringInquiry):
    doc = {**c.model_dump(), "id": str(uuid.uuid4()), "created_at": now_iso()}
    await db.catering_inquiries.insert_one(doc)
    return {"received": True}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()
