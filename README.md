# 🛍️ Xeno Shopify Data Ingestion & Insights Service  

This project was built as part of the **Xeno Forward Deployed Engineer (FDE) Internship – 2025** assignment.  
It simulates how Xeno helps enterprise retailers onboard, integrate, and analyze their customer data from Shopify.  

---

## 🚀 Features  

### 🔗 Shopify Data Ingestion Service  
- Connects to Shopify APIs and ingests:  
  - Customers  
  - Orders  
  - Products  
- Multi-tenant support: data is isolated using a tenant identifier.  
- Data is stored in **MySQL** with a clean schema.  

### 📊 Insights Dashboard  
- Built with **React.js**  
- Key metrics:  
  - Total customers, orders, and revenue  
  - Orders by date (with date range filtering)  
  - Top 5 customers by spend  
- Visualized with charts (Recharts).  

### ⚙️ Backend  
- **Node.js + Express.js**  
- Provides API endpoints for Shopify sync and analytics queries.  
- Uses environment variables for secrets (Shopify credentials, DB connection).  

---

## 🛠️ Tech Stack  

- **Backend:** Node.js (Express.js)  
- **Frontend:** React.js  
- **Database:** MySQL   
- **Charts:** Recharts  

---

## Credits

Built by **Swaroop** for the Xeno FDE Internship 2025 assignment.


## 📸 Screenshots  

### 🔐 Login Screen  
![Login](https://github.com/mjsswaroop/Xeno-Shopify/blob/2ab767a67af10994ae25479a672e82540f2da3c7/xeno/screenshots/login.png)  

### 📊 Dashboard Overview  
![Dashboard](https://github.com/mjsswaroop/Xeno-Shopify/blob/2ab767a67af10994ae25479a672e82540f2da3c7/xeno/screenshots/dashboard.png)  

### 📈 Register  
![Register](https://github.com/mjsswaroop/Xeno-Shopify/blob/2ab767a67af10994ae25479a672e82540f2da3c7/xeno/screenshots/register.png)  

### 👥 Top Customers & Quick Actions  
![Top Customers](https://github.com/mjsswaroop/Xeno-Shopify/blob/2ab767a67af10994ae25479a672e82540f2da3c7/xeno/screenshots/customers.png)  


## 🏗️ Architecture  

```mermaid
flowchart TD
    A[Shopify Store] -->|APIs| B[Backend Service - Express.js]
    B --> C[(MySQL Database)]
    C --> D[Insights Dashboard - React.js]
    D -->|HTTP Requests| B
