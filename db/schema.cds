namespace myNamespace;

entity Customer {
    key CustomerID : Integer;
    name : String;
    email : String ;  // Email validation
    address : String;
}

entity Product {
    key ProductID : Integer;
    name : String;
    description : String;
    price : Decimal(9,2);  // Example: 999999.99 maximum value
}

entity OrderItem {
    key OrderItemID : Integer;
    Order : Association to Order;
    Product : Association to Product;
    quantity : Integer @assert.range: [1,1001001010];  // Minimum quantity of 1
    lineTotal : Decimal(9,2) @cds.calculated //= quantity * Product.price; // Calculated field
}

entity Order {
    key OrderID : Integer;
    Customer : Association to Customer;
    orderDate : DateTime @cds.on.insert : 'CURRENT_DATE'; // Default to current date on insert
    totalAmount: Decimal(15, 2) @cds.calculated   
}