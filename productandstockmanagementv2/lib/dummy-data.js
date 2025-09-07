export const data ={
  "products":[
    {
      "id": "prod_001",
      "name": "iPhone 15 Pro",
      "description": "Latest Apple smartphone with titanium design and A17 Pro chip",
      "category": "Electronics",
      "subcategory": "Smartphones",
      "brand": "Apple",
      "sku": "APL-IP15P-128-BLK",
      "barcode": "123456789012",
      "price": 999.99,
      "costPrice": 750.00,
      "currency": "USD",
      "weight": 187,
      "dimensions": {
        "length": 146.6,
        "width": 70.6,
        "height": 8.25
      },
      "images": [
        "https://example.com/iphone15pro_1.jpg",
        "https://example.com/iphone15pro_2.jpg"
      ],
      "tags": ["smartphone", "apple", "premium", "5g"],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-08-20T14:45:00Z"
    },
    {
      "id": "prod_002", 
      "name": "Wireless Gaming Mouse",
      "description": "High-precision wireless gaming mouse with RGB lighting",
      "category": "Electronics",
      "subcategory": "Computer Accessories",
      "brand": "Logitech",
      "sku": "LOG-GM-WRL-001",
      "barcode": "234567890123",
      "price": 79.99,
      "costPrice": 45.00,
      "currency": "USD",
      "weight": 120,
      "dimensions": {
        "length": 125,
        "width": 63,
        "height": 42
      },
      "images": [
        "https://example.com/gaming_mouse_1.jpg"
      ],
      "tags": ["gaming", "mouse", "wireless", "rgb"],
      "isActive": true,
      "createdAt": "2024-02-10T09:15:00Z",
      "updatedAt": "2024-08-18T11:20:00Z"
    },
    {
      "id": "prod_003",
      "name": "Office Chair Ergonomic",
      "description": "Comfortable ergonomic office chair with lumbar support",
      "category": "Furniture",
      "subcategory": "Office Furniture", 
      "brand": "Herman Miller",
      "sku": "HM-OFC-ERG-BLK",
      "barcode": "345678901234",
      "price": 450.00,
      "costPrice": 280.00,
      "currency": "USD",
      "weight": 25000,
      "dimensions": {
        "length": 660,
        "width": 660,
        "height": 1100
      },
      "images": [
        "https://example.com/office_chair_1.jpg",
        "https://example.com/office_chair_2.jpg"
      ],
      "tags": ["furniture", "office", "ergonomic", "chair"],
      "isActive": true,
      "createdAt": "2024-01-20T13:45:00Z",
      "updatedAt": "2024-07-30T16:10:00Z"
    },
    {
      "id": "prod_004",
      "name": "Bluetooth Headphones",
      "description": "Noise-cancelling wireless headphones with 30h battery",
      "category": "Electronics",
      "subcategory": "Audio",
      "brand": "Sony",
      "sku": "SNY-WH-NC-BLK",
      "barcode": "456789012345",
      "price": 299.99,
      "costPrice": 180.00,
      "currency": "USD",
      "weight": 250,
      "dimensions": {
        "length": 200,
        "width": 180,
        "height": 80
      },
      "images": [
        "https://example.com/headphones_1.jpg"
      ],
      "tags": ["audio", "headphones", "wireless", "noise-cancelling"],
      "isActive": true,
      "createdAt": "2024-03-05T08:20:00Z",
      "updatedAt": "2024-08-15T12:30:00Z"
    },
    {
      "id": "prod_005",
      "name": "Stainless Steel Water Bottle",
      "description": "Insulated stainless steel water bottle 500ml",
      "category": "Home & Kitchen",
      "subcategory": "Drinkware",
      "brand": "Hydro Flask",
      "sku": "HF-SS-500-BLU",
      "barcode": "567890123456",
      "price": 34.95,
      "costPrice": 18.00,
      "currency": "USD",
      "weight": 350,
      "dimensions": {
        "length": 70,
        "width": 70,
        "height": 250
      },
      "images": [
        "https://example.com/water_bottle_1.jpg"
      ],
      "tags": ["bottle", "insulated", "stainless steel", "eco-friendly"],
      "isActive": true,
      "createdAt": "2024-04-12T14:00:00Z",
      "updatedAt": "2024-08-10T09:45:00Z"
    },
    {
      "id": "prod_006",
      "name": "LED Desk Lamp",
      "description": "Adjustable LED desk lamp with touch control and USB charging port",
      "category": "Home & Kitchen",
      "subcategory": "Lighting",
      "brand": "Philips",
      "sku": "PHL-LED-DSK-WHT",
      "barcode": "678901234567",
      "price": 89.99,
      "costPrice": 55.00,
      "currency": "USD",
      "weight": 800,
      "dimensions": {
        "length": 400,
        "width": 200,
        "height": 450
      },
      "images": [
        "https://example.com/desk_lamp_1.jpg"
      ],
      "tags": ["lamp", "led", "desk", "adjustable", "usb"],
      "isActive": true,
      "createdAt": "2024-02-28T11:30:00Z",
      "updatedAt": "2024-08-05T15:20:00Z"
    }
  ],
  "stock": [
    {
      "id": "stock_001",
      "productId": "prod_001",
      "quantity": 25,
      "minStockLevel": 5,
      "maxStockLevel": 100,
      "reorderPoint": 10,
      "reorderQuantity": 50,
      "location": "Warehouse A - Shelf 1A",
      "batchNumber": "BATCH_2024_001",
      "expiryDate": null,
      "supplier": "Apple Inc",
      "lastStockUpdate": "2024-08-20T14:45:00Z",
      "stockStatus": "IN_STOCK"
    },
    {
      "id": "stock_002",
      "productId": "prod_002", 
      "quantity": 3,
      "minStockLevel": 5,
      "maxStockLevel": 50,
      "reorderPoint": 8,
      "reorderQuantity": 25,
      "location": "Warehouse A - Shelf 2B",
      "batchNumber": "BATCH_2024_002",
      "expiryDate": null,
      "supplier": "Logitech International",
      "lastStockUpdate": "2024-08-18T11:20:00Z",
      "stockStatus": "LOW_STOCK"
    },
    {
      "id": "stock_003",
      "productId": "prod_003",
      "quantity": 8,
      "minStockLevel": 5,
      "maxStockLevel": 25,
      "reorderPoint": 5,
      "reorderQuantity": 15,
      "location": "Warehouse B - Section C",
      "batchNumber": "BATCH_2024_003", 
      "expiryDate": null,
      "supplier": "Herman Miller Inc",
      "lastStockUpdate": "2024-07-30T16:10:00Z",
      "stockStatus": "IN_STOCK"
    },
    {
      "id": "stock_004",
      "productId": "prod_004",
      "quantity": 2,
      "minStockLevel": 5,
      "maxStockLevel": 40,
      "reorderPoint": 6,
      "reorderQuantity": 20,
      "location": "Warehouse A - Shelf 3A",
      "batchNumber": "BATCH_2024_004",
      "expiryDate": null,
      "supplier": "Sony Corporation",
      "lastStockUpdate": "2024-08-15T12:30:00Z",
      "stockStatus": "LOW_STOCK"
    },
    {
      "id": "stock_005",
      "productId": "prod_005",
      "quantity": 45,
      "minStockLevel": 5,
      "maxStockLevel": 100,
      "reorderPoint": 15,
      "reorderQuantity": 50,
      "location": "Warehouse A - Shelf 4B",
      "batchNumber": "BATCH_2024_005",
      "expiryDate": null,
      "supplier": "Hydro Flask LLC",
      "lastStockUpdate": "2024-08-10T09:45:00Z",
      "stockStatus": "IN_STOCK"
    },
    {
      "id": "stock_006",
      "productId": "prod_006",
      "quantity": 1,
      "minStockLevel": 5,
      "maxStockLevel": 30,
      "reorderPoint": 8,
      "reorderQuantity": 20,
      "location": "Warehouse B - Shelf 1C",
      "batchNumber": "BATCH_2024_006",
      "expiryDate": null,
      "supplier": "Philips Electronics",
      "lastStockUpdate": "2024-08-05T15:20:00Z",
      "stockStatus": "CRITICAL_LOW"
    }
  ],
  "categories": [
    {
      "id": "cat_001",
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "parentId": null,
      "isActive": true
    },
    {
      "id": "cat_002",
      "name": "Furniture",
      "description": "Home and office furniture",
      "parentId": null,
      "isActive": true
    },
    {
      "id": "cat_003",
      "name": "Home & Kitchen",
      "description": "Home and kitchen essentials",
      "parentId": null,
      "isActive": true
    }
  ],
  "suppliers": [
    {
      "id": "sup_001",
      "name": "Apple Inc",
      "contactPerson": "John Smith",
      "email": "supplier@apple.com",
      "phone": "+1-555-0123",
      "address": {
        "street": "1 Apple Park Way",
        "city": "Cupertino",
        "state": "CA",
        "zipCode": "95014",
        "country": "USA"
      },
      "paymentTerms": "NET_30",
      "isActive": true
    },
    {
      "id": "sup_002",
      "name": "Logitech International",
      "contactPerson": "Sarah Johnson",
      "email": "orders@logitech.com", 
      "phone": "+1-555-0124",
      "address": {
        "street": "7700 Gateway Blvd",
        "city": "Newark",
        "state": "CA",
        "zipCode": "94560",
        "country": "USA"
      },
      "paymentTerms": "NET_15",
      "isActive": true
    }
  ],
  "stockMovements": [
    {
      "id": "mov_001",
      "productId": "prod_001",
      "type": "IN",
      "quantity": 50,
      "previousQuantity": 0,
      "newQuantity": 50,
      "reason": "PURCHASE",
      "reference": "PO-2024-001",
      "notes": "Initial stock purchase",
      "performedBy": "admin_001",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "mov_002",
      "productId": "prod_001",
      "type": "OUT",
      "quantity": 25,
      "previousQuantity": 50,
      "newQuantity": 25,
      "reason": "SALE",
      "reference": "SO-2024-001",
      "notes": "Bulk order sale",
      "performedBy": "user_001",
      "createdAt": "2024-08-20T14:45:00Z"
    },
    {
      "id": "mov_003",
      "productId": "prod_002",
      "type": "OUT",
      "quantity": 2,
      "previousQuantity": 5,
      "newQuantity": 3,
      "reason": "SALE",
      "reference": "SO-2024-002",
      "notes": "Customer purchase",
      "performedBy": "user_002",
      "createdAt": "2024-08-18T11:20:00Z"
    }
  ],
  "lowStockNotifications": [
    {
      "id": "notif_001",
      "productId": "prod_002",
      "productName": "Wireless Gaming Mouse",
      "currentStock": 3,
      "minStockLevel": 5,
      "severity": "MEDIUM",
      "message": "Stock level below minimum threshold",
      "isRead": false,
      "createdAt": "2024-08-18T11:20:00Z"
    },
    {
      "id": "notif_002", 
      "productId": "prod_004",
      "productName": "Bluetooth Headphones",
      "currentStock": 2,
      "minStockLevel": 5,
      "severity": "HIGH",
      "message": "Stock level critically low",
      "isRead": false,
      "createdAt": "2024-08-15T12:30:00Z"
    },
    {
      "id": "notif_003",
      "productId": "prod_006",
      "productName": "LED Desk Lamp",
      "currentStock": 1,
      "minStockLevel": 5,
      "severity": "CRITICAL",
      "message": "Stock level critically low - immediate reorder required",
      "isRead": false,
      "createdAt": "2024-08-05T15:20:00Z"
    }
  ],
  "users": [
    {
      "id": "user_001",
      "username": "john_manager",
      "email": "john@company.com",
      "role": "MANAGER",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "user_002",
      "username": "jane_staff",
      "email": "jane@company.com",
      "role": "STAFF",
      "firstName": "Jane",
      "lastName": "Smith", 
      "isActive": true,
      "createdAt": "2024-01-02T00:00:00Z"
    },
    {
      "id": "admin_001",
      "username": "admin",
      "email": "admin@company.com",
      "role": "ADMIN",
      "firstName": "Admin",
      "lastName": "User",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "warehouses": [
    {
      "id": "wh_001",
      "name": "Main Warehouse A",
      "code": "WH-A",
      "address": {
        "street": "123 Storage St",
        "city": "Business City",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
      },
      "manager": "John Warehouse",
      "phone": "+1-555-0199",
      "isActive": true
    },
    {
      "id": "wh_002", 
      "name": "Secondary Warehouse B",
      "code": "WH-B",
      "address": {
        "street": "456 Storage Ave",
        "city": "Business City",
        "state": "CA", 
        "zipCode": "90211",
        "country": "USA"
      },
      "manager": "Sarah Warehouse",
      "phone": "+1-555-0200",
      "isActive": true
    }
  ]
}