using myNamespace from '../db/schema';

service Main{

    entity Customers as projection on myNamespace.Customer;
    entity Products as projection on myNamespace.Product;
    entity OrderItems as projection on myNamespace.OrderItem;
    entity Orders as projection on myNamespace.Order;
    action calcOrderItem(OrderItem:OrderItems);
    action MyFunc(Object:OrderItems);
    action TotalAmount(Object:Orders);
    
}