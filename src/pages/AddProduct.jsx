import { FieldArray, Formik,Form } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import Modal from '../component/modal/Modal'
import SearchInput from '../component/search'
import ProductForm from '../component/selectInput'
import useAxios, { cancelApi } from '../hooks/useAxios'
import {useSelector} from "react-redux"
import axios from 'axios'


const AddProduct = () => {

  const initial_value=useSelector(state=>state.Product.selectedProduct)
  //  ------------------------------------------define the states------------------------------------------
    const [showModal, setShowModal] = useState(false);
     const [discountIndex,setDiscountIndex]=useState([])
  const [variantsIndex,setVariantsIndex]=useState([])
  const [searchValue,setSearchValue]=useState('')
  const[pageNumber,setPageNumber]=useState(1)
  const  [productData,setProductData]=useState([])
  const [editData,setEditData]=useState({})
 
  
useEffect(()=>{
  formRef.current.setFieldValue('checked',initial_value?.checked)
},[initial_value])
  console.log("selected product",initial_value)


  

//  ------------------------------define the ref----------------------------------------------------   
     const dragItem=useRef(null)
     const dragOveritem=useRef(null)
     const dragVaritantItem=useRef(null)
     const dragOverVariantItem=useRef(null)
     const formRef=useRef(null)

     const AxiosApi=useAxios()
     useEffect(() => {
      setProductData([])
     
    }, [searchValue])

     useEffect(()=>{
      const source=axios.CancelToken.source()
      AxiosApi.get(`shop/product?search=${searchValue}&page=${pageNumber}`,{cancelToken:source.token}).then((res)=>{setProductData((pre)=>res===null?[]:[...res,...pre])}).catch((e)=>{if(axios.isCancel(e)) return })
      return ()=>source.cancel()
     },[searchValue,pageNumber])
// ---------------------------------------open the Modal-----------------------------------------
     const openModal = () => setShowModal(true);

    //  -----------------------------------handle the parent product sorting-------------------------------
    const handleDragSorting=(type,index)=>{
      
    const products = [...formRef.current.values.checked];
    const removed = products.splice(dragItem.current, 1)[0];
    products.splice(dragOveritem.current, 0, removed);
    formRef.current.setFieldValue('checked', products);
    dragItem.current=null
    dragOveritem.current=null
      
    
    }
  // ------------------------------------handle the variants product sorting-------------------------------------
    const handleVariantsSort=(index)=>{
      const _variants=[...formRef.current.values.checked[index].variants]
      const removed=_variants.splice(dragVaritantItem.current,1)[0]
      _variants.splice(dragOverVariantItem.current,0,removed)
      console.log("check teh ",_variants,removed)
      formRef.current.setFieldValue(`checked.${index}.variants`,_variants)
      dragVaritantItem.current=null;
      dragOverVariantItem.current=null;
    }

  // -------------------------------------pass the parent product discount value to the variants product------------  
    const handleDiscountValue=(e,index,res,setValue)=>{
       setValue(`checked.${index}.discount`,e.target.value)
       setValue(`checked.${index}.discount_type`,'flat')
       res.variants.map((val,i)=>{
        setValue(`checked.${index}.variants.${i}.discount`,e.target.value)
        setValue(`checked.${index}.variants.${i}.discount_type`,'flat')
       })
    }

    // -------------------------------store the index of discount button to show discount input---------------------------------
    const handleShowDiscount=(index)=>{
      setDiscountIndex(pre=>[...pre,index]);
    }

//  ------------------------------------store the index of variants index to show the variants product--------------------------
    const handleShowVariants=(index)=>{
   setVariantsIndex((pre)=>[...pre,index])
    }

    // ---------------------------------hide the variants product based on index when user click on hide variants-----------------------
    const handleHideVariants=(index)=>{
      console.log("length and index",variantsIndex.length,index)
      variantsIndex.splice(variantsIndex.indexOf(index),1)
      setVariantsIndex([...variantsIndex])
    }

    const handleSearch=(e)=>{
      console.log("search",e.target.value)
      setSearchValue(e.target.value)
     
    }

  return (
   <div className='App'>
   <h1>Add The Product</h1>
    <div className='heading'>
     <div>Product</div>
     <div>Discount</div>
    </div>
  {/* --------------------------------------product modal---------------------------------------------------------------- */}
      <Modal showModal={showModal} setShowModal={setShowModal}  title='Select Product' handleSearch={handleSearch} >
        <ProductForm mapValues={productData} handleClose={setShowModal} editData={editData} pageNumber={setPageNumber} />
      </Modal>
  
  
   <Formik innerRef={formRef} initialValues={initial_value} onSubmit={(val)=>{console.log("check the value",val)}}>
    {({values,handleChange,setFieldValue})=>(
    <Form>
      {/* -----------------------------------------parent products maping-----------------------------------------  */}
            <FieldArray name="checked">
              {({push,remove})=>(
                <>
              {values?.checked?.map((res,i)=>{
                return <div key={i} draggable  onDragStart={(e)=>{dragItem.current=i}} onDragEnter={(e)=>dragOveritem.current=i} onDragEnd={handleDragSorting}>
                        {/* -------------------------------show the parent product name-----------------------------  */}
                       <div className='parent_product_div'>
                        <div className='group_dot'><img src={require('../asset/images/group_dot.png')} alt='dot'/> <span>{i+1}.</span> </div>
                        <div className='show_product_title'>
                        <div className='product_name'>{res?.title}</div>
                        <button type='button' onClick={()=>{openModal();setEditData({...res,editIndex:i})}} ><i className='fa fa-pencil'/></button>
                        </div>
                        {discountIndex.includes(i)?
                        <div className='discount_main_div'>
                       <input id={res.id} name={`checked.${i}.discount`} className='input_field' onChange={(e)=>handleDiscountValue(e,i,res,setFieldValue)} />
                       <select className='select' name={`checked.${i}.discount_type`} onChange={handleChange} value={res?.discount_type?res.discount_type:""}>
                        <option value="flat" defaultValue>flat</option>
                        <option value="%off">% off</option>
                       </select>
                       </div>
                        :
                        <button type='button' className='add_discount_button'  onClick={()=>handleShowDiscount(i)}>add discount</button>
                        }
                     { values?.checked.length>1?<div onClick={()=>remove(i)} className='close_icon'>x</div>:""}
                      </div>
{/* -------------------------------------------------------------variants product maping-------------------------------------------------------------- */}
                      <>
                       {res?.variants?.length>1?<div className='text_right'>{variantsIndex.includes(i)?<span onClick={()=>handleHideVariants(i)}>Hide Varients <i className='fa fa-angle-down'/></span>:<span onClick={()=>handleShowVariants(i)}>Show Varients <i className='fa fa-angle-up'/></span>}</div>:""}
                       <FieldArray name={`checked.${i}.variants`}>
                          {({push,remove})=>(
                           variantsIndex.includes(i)&&<>
                            {res.variants.map((val,index)=>{
                              return<div className='show_variants_div' key={index} draggable onDragStart={()=>dragVaritantItem.current=index} onDragEnter={()=>dragOverVariantItem.current=index} onDragEnd={(e)=> {e.stopPropagation(); handleVariantsSort(i)}}>

                                <div className='group_dot'><img src={require("../asset/images/group_dot.png")} alt='dot'/> <span>{index+1}.</span> </div>
                               <div className='show_variant_title'>{val.title}</div> 
                               {discountIndex.includes(i)&&<>
                                <input id={res.id} className='input_field' name={`checked.${i}.variants.${index}.discount`} value={val.discount}  onChange={handleChange} />
                              <select className='select' name={`checked.${i}.variants.${index}.discount_type`} onChange={handleChange} >
                                <option value="flat" defaultValue>flat</option>
                             <option value="%off">% off</option>
                              </select>
                              </>}
                                <div style={{cursor:"pointer"}} className='close_icon' onClick={()=>remove(index)}>X</div>
                              </div>
                            })}
                            </>
                          )}
                       </FieldArray>
                      </>
                </div>
              })}

              <div className='add_button'><button  type='button' onClick={()=>push({})}>Add Product</button></div><br/>
              </>
              )}
            
            </FieldArray>


        {/* <button type='submit'>Submit</button> */}
    </Form>
     
     )}
     
     </Formik>
 
   </div>
  )
}

export default AddProduct