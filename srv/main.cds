using myNamespace from '../db/schema';

service Main{

    entity Customers as projection on myNamespace.Customer;
    entity Products as projection on myNamespace.Product;
    entity OrderItems as projection on myNamespace.OrderItem;
    entity Orders as projection on myNamespace.Order;

     action createOrder(
        OrderID : Integer,
        customerID: Integer,
        items : many OrderItemsInput
    ) returns String;
    action calcOrderItem(OrderItem:OrderItems);
    action MyFunc(Object:OrderItems);
    action TotalAmount(Object:Orders);
    action calculateTotalDiscount( Order:Orders , discountRate :  Decimal(9,2)) returns Integer;
    
}

type OrderItemsInput {
    ID:Integer;
    ProdID: Integer;
    OrdID: Integer;
    quantity: Integer;  
}

