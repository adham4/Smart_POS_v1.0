# 🍔 Smart POS System for Restaurants

An advanced POS (Point of Sale) system designed specifically for restaurants and cafes. Smart POS helps you manage orders, track inventory, generate detailed sales reports, and enhance customer experience.

---

## 🚀 **Features**
✅ **Order Management**  
- Add, edit, and cancel orders with ease  
- Track order details and history  

✅ **Inventory Management**  
- Real-time inventory tracking  
- Automatic deduction based on recipes  
- Low stock and expiration alerts  

✅ **Discount Management**  
- Create and manage discount codes  
- Apply discounts automatically to orders  

✅ **Customer Management**  
- Save customer details and order history  
- Reward points and customer insights  

✅ **Advanced Reporting**  
- Daily and monthly sales reports  
- Interactive charts and sales analysis  

✅ **User Roles**  
- **Admin:** Full access to the system  
- **Cashier:** Restricted access to order handling only  

✅ **Payment Integration**  
- Support for Paymob, Visa, Mastercard, and InstaPay  

✅ **Thermal Printer Support**  
- Print receipts directly from the system  

---

## 📸 **Screenshots**
| Dashboard | Order Management | Inventory Tracking |
|:---------:|:----------------:|:-----------------:|
| ![Dashboard](screenshots/dashboard.png) | ![Order](screenshots/order.png) | ![Inventory](screenshots/inventory.png) |

---

## 💻 **Installation**
1. **Clone the repository**  
```bash
git clone https://github.com/adham4/Smart_POS_v1.0.git

npm install
node server

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

