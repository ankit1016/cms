import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import "./checkbox.css"
import {useSelector,useDispatch} from 'react-redux'
import Loader from '../loader';
import { ProductAction } from '../../redux/reducers/ProductSlice';
// const mapValues = [
//     {
//         "id": 77,
//         "title": "Fog Linen Chambray Towel - Beige Stripe",
//         "variants": [
//             {
//                 "id": 1,
//                 "product_id": 77,
//                 "title": "XS / Silver",
//                 "price": "49"
//             },
//             {
//                 "id": 2,
//                 "product_id": 77,
//                 "title": "S / Silver",
//                 "price": "49"
//             },
//             {
//                 "id": 3,
//                 "product_id": 77,
//                 "title": "M / Silver",
//                 "price": "49"
//             }
//         ],
//         "image": {
//             "id": 266,
//             "product_id": 77,
//             "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
//         }
//     },
//     {
//         "id": 80,
//         "title": "Orbit Terrarium - Large",
//         "variants": [
//             {
//                 "id": 64,
//                 "product_id": 80,
//                 "title": "Default Title",
//                 "price": "109"
//             }
//         ],
//         "image": {
//             "id": 272,
//             "product_id": 80,
//             "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
//         }
//     }
// ]





const ProductForm = ({mapValues,handleClose,editData,pageNumber}) => {
  // const [mapData, setMapData] = useState(mapValues);
//   const initialValues={
//     checked:[]
// }
const initialValues=useSelector(state=>state.Product.selectedProduct)
  
  

  const formRef=useRef(null)

 const dispatch= useDispatch()
  const [variantCount,setVariantCount]=useState(0)
  const spinner=useSelector((state=>state.Theme.spinner))
  
    console.log("check edit data",editData)
    const observer = useRef()
    const lastElementRef = useCallback(node => {
        if(spinner)
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting ) {
          pageNumber(prevPageNumber => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    }, [spinner])

  const handleSelectAll = (push,res,index,) => {
  
    if(Object.keys(editData).length){
     formRef.current.setFieldValue(`checked.${editData.editIndex}`,res)
     mapValues[index].variants.forEach((val)=>{
      document.getElementById(val.id).checked=true
         return {...val}
        })
    }
    else{
    push(res);
    console.log(formRef.current.values)
    mapValues[index].variants.forEach((val)=>{
  document.getElementById(val.id).checked=true
     return {...val}
    })
  }
  };


  const handleUnSelectAll=(remove,index)=>{
   
    remove(index)
    mapValues[index].variants.forEach((val)=>{
      document.getElementById(val.id).checked=false
      return {...val}
    })
  }

 const handleVariantsSelect=(push,val,res,i)=>{
  if(Object.keys(editData).length){
    // push(val)
   setVariantCount((pre)=>pre+1)
   let preval=formRef.current.values.checked[editData.editIndex]?.variants?.length?formRef.current.values.checked[editData.editIndex].variants:[]
    console.log("check teh pre val",preval)
    console.log("compare the value",editData,res)
    if(editData.id){
      if(editData.id!==res.id){preval=[];editData.id=res.id;}
    }
    formRef.current.setFieldValue(`checked.${editData.editIndex}.title`,res.title)
    formRef.current.setFieldValue(`checked.${editData.editIndex}.id`,res.id)
    formRef.current.setFieldValue(`checked.${editData.editIndex}.variants`,[...preval,val])
    console.log("check the values",formRef.current.values.checked)
    document.getElementById(res.id).checked=true
  }
  else{
     push(val)
     formRef.current.setFieldValue(`checked.${i}.title`,res.title)
     formRef.current.setFieldValue(`checked.${i}.id`,res.id)
     console.log("check the values",formRef.current.values.checked)
     document.getElementById(res.id).checked=true
  }
  }

const handleVariantsUnSelect=(remove,index,i)=>{
 remove(index)
 setVariantCount(pre=>pre-1)
 console.log("cehck the console",variantCount)
  // document.getElementById(formRef.current.values?.checked[i]?.id).checked=false
  if(variantCount===1){
  const products = [...formRef.current.values.checked];
   products.splice(i, 1);
   if(formRef.current.values?.checked[i]?.id) document.getElementById(formRef.current.values?.checked[i]?.id).checked=false
  formRef.current.setFieldValue('checked', products);
  }

}

const handleSubmit=(val)=>{
dispatch(ProductAction.setSeletedProduct(val));
setVariantCount(0)
handleClose(false)
}

  return (
  
<>
  {spinner ?<Loader/>:
    <Formik innerRef={formRef} initialValues={initialValues} onSubmit={handleSubmit}>
        {()=>(
      <Form>
      <FieldArray name='checked'>
        {({push,remove})=>(
    <>
       {mapValues?.map((res,i)=>{
       return <>
           <div className='checkbox_product_name border_bottom'>
           <input type='checkbox' id={`${res.id}`} name={`${res.id}`} onChange={(e)=>{e.target.checked ?handleSelectAll(push,res,i) :handleUnSelectAll(remove,i)}} />{res?.image?.src?<img alt='product_img' src={res?.image?.src} />:""} <label htmlFor={`${res.id}`}>{res.title}</label>
           </div>

       <FieldArray name={`checked.${i}.variants`}>
            {({push,remove})=>(
            <div className='variants_checkbox'>
              {res?.variants?.map((val,index)=>{return <><div className='variant_main_div' key={index}>
               
                <div>
                <input type='checkbox' id={`${val.id}`} name={`val.${[index]}`} onChange={(e)=>{e.target.checked?handleVariantsSelect(push,val,res,i):handleVariantsUnSelect(remove,index,i)}}   checked={val.checked} />
                <label htmlFor={val.title}>{val.title}</label>
                </div>
                <div className='variant_details'>
                  <div>{val?.inventory_quantity?val.inventory_quantity:0} available</div>
                  <div> ${val.price}</div>
                </div>
                
                </div>{res?.variants.length-1===index?"": <hr />}</>
              } )}
            </div>
            )}
        </FieldArray>
        {mapValues.length===i+1&&<label ref={lastElementRef} htmlFor={res.title}>{res.title}</label>}
         </>})}
         
        </>)}
     </FieldArray>
    
        <div className='product_form_button'>
          <div></div>
         <div>
        <button className='cancel_button' type='button' onClick={()=>handleClose(false)}>Cancel</button> 
        <button className='submit_button' type='submit' >Add</button></div>
        </div>
      
      </Form>
        )} 

    </Formik>}
    </>
  );
};

export default ProductForm;
