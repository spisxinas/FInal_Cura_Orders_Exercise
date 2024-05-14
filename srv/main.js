const cds = require('@sap/cds');
const {Product,OrderItem} = cds.entities('myNamespace');


module.exports = srv => {

   const  { OrderItem, Order , Product } = cds.entities('myNamespace');


  srv.before('READ','/',async(req)=>{
    console.log("hello world");
  })

  srv.after('READ','OrderItems',async(items,req)=>{
    
   await SetLineTotal(items,req)

  })
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  srv.after('CREATE','OrderItems',async (data, req) =>{

    //await SetLineTotal(data,req);

    const orderId = data.Order_OrderID;
    
    let myOrder;
    let lineTotals;
    let result;
    let sum = 0;

    if(orderId){
      const myProduct = await cds.tx(req).run(SELECT.one.from(Product).where({ ProductID : data.Product_ProductID }));
      
      if (myProduct){
        data.lineTotal = data.quantity * myProduct.price;
      }
    }
    
    const mylineTotal = data.lineTotal;
    
    if(orderId && mylineTotal){

       myOrder = await cds.tx(req).run(SELECT.one.from(Order).where({ OrderID: orderId }));
        result = await cds.tx(req).run(SELECT.from(OrderItem).where({ Order_OrderID: orderId }));

        for (const item of result){
          if(item && item.Product_ProductID){
            const product = await cds.tx(req).run(SELECT.one.from(Product).where({ProductID: item.Product_ProductID}));
            if (product){
              item.lineTotal = item.quantity * product.price;
              await cds.tx(req).run(UPDATE(OrderItem).set({lineTotal: item.lineTotal}).where({ OrderItemID: item.OrderItemID }));
            }
          }
        }

        result = await cds.tx(req).run(SELECT.from(OrderItem).where({ Order_OrderID: orderId }));

        for (const item of result){
          if(item){
            sum = sum + item.lineTotal;
          }
        }

        console.log(sum);
    }
    
    if (myOrder && sum){  
      await cds.tx(req).run(UPDATE(Order).set({totalAmount: sum}).where({ OrderID: orderId }));
    }

    console.log(data);
  })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
async function SetLineTotal(items,req){

  if (!Array.isArray(items)) items = [items];

  for (const item of items){
    if (item && item.Product_ProductID){
      const product = await cds.tx(req).run(SELECT.one.from(Product).where({ProductID: item.Product_ProductID}));

      if (product){
        item.lineTotal = item.quantity * product.price
        await cds.tx(req).run(UPDATE(OrderItem).set({lineTotal: item.lineTotal}).where({ OrderItemID: item.OrderItemID }));
      }
    }
  }
  
}


//   srv.before('CREATE','OrderItems', async (req) => { 
//   const {OrderItemID,Order_OrderID,Product_ProductID , quantity } = req.data;
//   if (!Product_ProductID || !quantity) return;
//   const product = await cds.run(SELECT.one('price').from(Product).where({ ProductID : Product_ProductID }))
//   if (product) {     
//       req.data.lineTotal = product.price * quantity;
//   }    
//  })

 

  //  srv.on(['CREATE','UPDATE'],'OrderItems',async(req)=>{
    
  //   const {Order_OrderID,Product_ProductID,quantity} = req.data; 
  //   const relatedItems = await cds.run(SELECT.from(OrderItem).where({Order_OrderID: Order_OrderID }))
  //   const totalAmount = relatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  //   console.log(totalAmount);
  //   await cds.run(UPDATE(Order).set({ totalAmount }).where({ OrderID: Order_OrderID }));
    

  //   console.log(totalAmount);
    
  //   return 
  //  })


///////////////////////////////////////////////////////////////////////////////



   // srv.on('MyFunc',async (req)=>{
  //   const MyObject = req.data.Object;    
    
  //   const num = await cds.run(SELECT.one('price').from(Product).where({ProductID:MyObject.Product_ProductID}))
  //   const int = parseFloat(num.price);
  //   const Total = {"lineTotal":int * MyObject.quantity};

  //   const Result = Object.assign({},MyObject,Total);
  //   await srv.insert(Result).into('OrderItems');
  // })




   // srv.on('TotalAmount',async(req)=>{
  //   const myObject = req.data.Object;
  //    const sum = await cds.run(SELECT.one('SUM(lineTotal)').from(OrderItem).where({Order_OrderID:myObject.OrderID}));
  //   const Amount = {"totalAmount":sum.SUM}
  //    const Result = Object.assign({},myObject,Amount);
  //   await srv.insert(Result).into('Orders');
   
  //  })
 }

 