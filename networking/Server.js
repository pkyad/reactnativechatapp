import React, { Component } from 'react';
import {
  StyleSheet,
  SectionList,
  StyleSheet,
  Text,
  View,Alert,Platform
} from 'react-native';

const getchats='https://app.syrow.com/api/support/supportChat/';
const postchats='https://app.syrow.com/api/support/supportChat/';

async function getchatsfromserver(){
    try{
        let response=await fetch(getchats);
        let responseJson=await response.json;
        return responseJson;

    }
    catch(error){
        console.error(`Error is : ${error}`);
    }
}
async function insertdata(params){

    try{
        let response=await fetch(postchats,{
         method: 'POST',
         headers:{
             'Accept':'application/json',
             'Content-Type':'application/json', 
        },
       body: JSON.stringify(params)
    });

        let responseJson=await response.json();
        return responseJson;
    }
    catch(error){
        console.error(`Error is : ${error}`);
    }
}
export {getchatsfromserver};
export {insertdata};
