import axios from "axios";

const doUpdate = async (url, token, id, data ) => {
   /* const response = await fetch(id?`${url}${id}`:url, {
        method: id? 'PUT':'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        },
        body: JSON.stringify(data),
    });*/

    /*fetch(id?`${url}${id}`:url, {
        method: id? 'PUT':'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        },
        body: JSON.stringify(data),
    }).then(response=>{
        console.log('RES::',response)
        return response;
    })
        .catch(error=>{
            console.log('ERROR::',error)
            return error;
        })*/

   if(id){
       const response= await axios.put(id ? `${url}${id}` : url,  data,{

           headers: {
               'Content-Type': 'application/json',
               'Authorization': "Bearer " + token,
           }
       }).catch(error => {
           console.log(error)
           throw new Error(error?.message)
       })

       return response?.data

   }else {
       const response= await axios.post(id ? `${url}${id}` : url,  data,{
           validateStatus: function (status) {
               return status >= 200 && status < 300; // default
           },
           headers: {
               'Content-Type': 'application/json',
               'Authorization': "Bearer " + token,
           }
       }).catch(error => {
           if (error.response) {
               throw new Error(error?.message)
           } else if (error.request) {
               throw new Error(error?.message)
           } else {
               console.log(error)
           }


       })

       console.log(response)
      /* if(response?.code <200 || response?.code>300){
           throw  new Error(response?.message)
       }*/
       return response?.data
   }

};

export default doUpdate;