const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const app=express();
const _=require('lodash')
const mongoose=require('mongoose');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
const db=mongoose.connection;
const blogSchema ={
    name:  String
};
let test_1=null;
let map=new Map();
const item=mongoose.model("Item",blogSchema);//moddelname is item
// const item=mongoose.model("Item",blogSchema);//moddelname is item


var a;

var data= item.find({});


app.get("/",async  (req,res)=>
{
    let arr=[];
    let arr_id=[];
        // item.find((err,results)=>
        // {
        //     if(err)
        //     console.log(err);
        //     else
        //     {
        //         // console.log("test");
        //         // console.log(results);
        //     results.forEach((x)=>
        //     {
        //         // console.log(x);
        //         arr.push(x.name);
        //     })
        // }
        // });

        // async await
        try{
            const results = await item.find({})
            results.forEach(item => {
                arr.push(item.name)
                arr_id.push(item._id);
            })
          
            res.render('index.ejs',{ day:"To Do List",arr:arr,arr_id:arr_id,model_name:"item"});
        } catch(err){
            // console.log(err)
            res.send("Error", err)
        }

        // .then() .catch()
        // item.find({})
        // .then(results => {
        //     results.forEach(item => {
        //         arr.push(item.name)
        //     })
        //     console.log(arr)
        //     res.render('index.ejs',{ day:"To Do List",arr:arr})
        // })
        // .catch(err => {
        //     console.log(err);
        //     res.send("Error", err)
        // })
    
})
function middleware(req,res,next)
{
    let url=req.url.slice(1);
    // console.log("middleware works fine");
    if(map.get(url)===undefined)
    {
        // console.log("test2");
        map.set(url,mongoose.model(`${url}`,blogSchema));
        // console.log(map.get(url));
    }
    next();
}
app.get("/:id",middleware,async (req,res)=>
{
    // console.log(req.url.slice(1));
        let reference=map.get(req.url.slice(1));
        // console.log(reference);
        var model_name=await reference.find();
    let data=[];
    let data_id=[];
    model_name.forEach((value)=>
    {
        data.push(value.name);
        data_id.push(value._id);
    }
    )

    res.render('index.ejs',{ day:req.url.slice(1),arr:data,arr_id:data_id,model_name:req.url.slice(1)});
    }
   
    

)
app.post("/delete",async (req,res)=>
{
   
   
    
    if(map.get(req.body.table_name)===undefined)
    {
        // console.log("test2");
        map.set(req.body.table_name,mongoose.model(`${req.body.table_name}`,blogSchema));
        // console.log(map.get(url));
    }
    console.log(req.body.table_name);
    
    console.log(req.body.checkbox);
    let reference=map.get(req.body.table_name);
    console.log(reference);
    try {
        await reference.deleteOne({ _id:req.body.checkbox }
            // deleted at most one tank document
          );
          res.redirect("/"+req.body.table_name);
          console.log("OK done");

    } catch (error) {
        console.log(error);
        
    }
    // await reference.delete({ _id:req.body.checkbox }
    //     // deleted at most one tank document
    //   ).then((result) => {
    //       res.redirect("/"+req.body.table_name);
    //       console.log("OK done");
    //   }).catch((err) => {
    //     console.log(err);
          
    //   });
}
)
app.post("/:id",middleware,async(req,res)=>
{
    // let model_name=req.url.slice(1);
    
        a=req.body.newItem;
        const reference_model=map.get(req.url.slice(1));
       let obj=new reference_model(
           {
               name:a
           }
       )
        obj.save();
    
    //    res.redirect("/:id");
  res.redirect(req.url);
   
}
)
// app.post("/delete",async (req,res)=>
// {
   
//     console.log(req.body.table_name);
//     console.log("xyz");
//     let reference=map.get(req.body.table_name);
//     console.log(reference);
//     await reference.findOneAndRemove({ _id:req.body.checkbox }, function (err) {
//         if (err) 
//         {
//             console.log(err);
//             res.send("Error",err);
//         }
//         else
//         res.redirect("/");
      
//         // deleted at most one tank document
//       });
// }
// )
app.listen(3000);
// mongoose.connection.close();