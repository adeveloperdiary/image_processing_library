#REST Response Configuration 

!!! abstract
    The Framework uses the response configurations in order to generate the response for Microservice.
    


## Overview
- The `response` section needs to be added in the Framework Configuration.
- Based on the configuration defined the response JSON can be generated.

## Features Supported

* Different Types of JSON elements​
* Data Type​s such as string, number etc
* Custom Array​s (Find more details below)
* Transformations​ (lower case, trim etc)
* Custom Functions​
* Rules​
* Enumeration*
* No limitation on number of JSON attribute levels.



## Basic Structure
- Below json configuration needed for creating one element.
``` json
{
    "response": [
     {
          "field": "item",
          "type": "object",
          "children": [
                {
                  "field": "claimNumber",
                  "tableName": "T_ABS_REQ",
                  "columnName": "b.ABS_NUM_CD",
                  "type": "generic",
                  "dtype": "string"
                }
          ]
     }]
}
```
    
- It will create a structure like below.
``` json    
{
    "item": {
        "claimNumber" :'1234'
    }
}
```
        
- As you see, 
    - `field` : is the name of the JSON element.
    - `type`  : is the type of JSON element.
    - `tableName,columnName` : Source of the data
    - `dtype` : Data Type of the JSON element
- like above, there might be required and optional parameters for different scenario.

### Generic Configurations 

- **JSON Elements**
    - The `type` attribute defines which JSON Element needs to be created. 

        | Feature  	| type=  	| Example |  Comments 	|   
        |---	    |---	    |---|---	        |
        |  Element​ 	| generic  	| <code>{ fname : 'john' }</code>  |              	|
        |  Array​ 	| array  	| <code> { item: [] } </code>| Need to set `injectTableName`  	        |
        |  Object​ 	| object  	| <code>{ extension: { zip_code: 20548 }}</code>| Nested JSON Element  	        |
        |  Constant	| constant 	| <code>{ currency : 'USD' } </code>| Constant Value  	        |

- **Data Types**
    - The `dtype` attribute defines the data type of the element.
    
        | Feature  	| dtype=  	| Example |  Comments 	|   
        |---	    |---	    |---|---	        |
        |  String 	| string  	| <code>{ fname : 'john' }</code>   |  Default            	|
        |  Float 	| double  	| <code> { amount : 25.45 } </code> |  Float Value 	        |
        |  ​Numeric 	| number  	| <code>{ year : 2018 }</code>      |  Integer Value 	        |
        |  Boolean	| bool 	| <code>{ available : false } </code>   |  NULL or Empty = false 	        |
        
## Element Types

### Basic Element
 - The following configuration will create a basic String element.
    
``` json
{
  "type": "generic",
  "field": "claim_number",
  "tableName": "T_CLM_PY",
  "columnName": "b.CLAIM_NUMBER",
  "dtype": "string"
}
```

- Details
    - `type` : `generic`
    - `field` : Name of the response field.
    - `tableName` : Name of the key in the map object. This can be the name of the HBase table or also name of `injectTableName` or custom name defined in Java Code.
    - `columnName` : Name of the key present in the map retrieved using the `tablename`. Again this can be name of HBase column name, or Array Element name ( In case of Array)
    - `dtype` : Can be any of the supported values. 


### Object​ Element

- You can create JSON Objects like below. 
- There are no limitation on the depth.
- Sample REST Response
    ```json
    
    "extension": {
      "adjustmentFrequencyCode": "4353"
    }
    
    ```
- Framework configuration for the above response

    ```json
    {
      "type": "object",
      "field": "extension",
      "children": [
        {
          "field": "adjustmentFrequencyCode",
          "tableName": "T_DABL_PLN",
          "columnName": "b.BEN_ADJ_AMT_MODE_CD",
          "type": "generic",
          "dtype": "string"
        }
      ]
    }
    ```
    
- Details
    - `type` : `object`
    - Only `type` and `field` need to be defined for JSON Objects.
    - The child elements needs to be inside `children` array.
    - There is no limitation on number of children.
    - Each children can be of different types (e.g. Another Object, Array, Constant etc)

??? example "Multilevel Example"
    Here is an example of more than one level\depth.
    
    **JSON Response**
    
    ``` json
    "extension": {
          "adjustmentAmount": {
                "amount":100.50
          }
    }
    ```
     **Framework Configuration**
    
    
    ``` json
    {
      "type": "object",
      "field": "extension",
      "children": [
        {
            "type": "generic",
            "field": "adjustmentAmount",
            "children": [
                {
                  "field": "amount",
                  "tableName": "T_DABL_PLN",
                  "columnName": "b.BEN_ADJ_AMT",
                  "type": "generic",
                  "dtype": "double"
                }
            ]
        }
      ]
    }
    ```

### Array​ Element
- JSON Array can be generated by setting up following properties.
    - `type` : `array`
    - `tableName` : Actual map key name.
    - `columnName` : Table column name, this needs to be Map
    - `injectTableName` : Dummy table name which each child element needs to refer.
    - `children` : List of all the children for each array element.
    
- Configuration
    
    ```json
    {
      "type": "array",
      "field": "items",
      "tableName": "CLAIM_PAYMENT",
      "columnName": "OVER_PAYMENTS",
      "injectTableName": "PAYMENTS",
      "children": [
        {
          "type": "generic",
          "field": "number",
          "tableName": "PAYMENTS",
          "columnName": "NUMBER",
          "dtype": "string"
        }
      ]
    }
    ```
     
- As we are seeing above, the `columnName` of the children is referring to the `injectTableName` of the `array` element. The Framework will internally create a Map using the provided `injectTableName`, which will be available to each array element.

- Output

    ```json
    
    "items": [
      {
         "number":"34234234"
      },
      {
         "number":"465466654"
      }
    ]
    
    ```

### Constant Element
- Generally there is no specific Constant element in JSON, however whenever we are building a service we might have requirement to have constant values for specific fields.
- The Framework supports this by setting `type` as `constant`
- Configuration

    ``` json
    {
      "field": "currencyCode",
      "type": "constant",
      "dtype": "string",
      "value": "USD"
    }
    
    ```

- Sample Output

    ```json
      {
         "currencyCode":"USD"
      }
    
    ```

### Custom Rules
- In case there are custom rule which needs to be invoked in order to generate the response for any given entity, 
    - `type` needs to be set as `custom`
    - `methodName` needs to be provided which has the rule implementation.

- Configuration
    ``` json
    {
      "type": "custom",
      "field": "self",
      "methodName": "getOverpayments_Self"
    }
    ```
- Java Code
    - There needs to be a Rule Class which should extend `BaseServiceImpl`
        - The `<Name>ServiceImpl` class can be used if its already extending the `BaseServiceImpl`.
        - Just pass the `this` object in this case to the `#!java response = eosAPIFramework.responseMetadataAdaptor.createMapping( mappings, data, response, this)` method as the last parameter.
        - Otherwise instantiate the class and pass that as the last parameter. 
    - Add the configured method to the class.
    - Below is the implementation of the `self` custom method.
    ```java
    public String getOverpayments_Self(HashMap<String, Object> data) 
    {
        String strReturnVal="";
        try {
            strReturnVal="https://"
                + profile 
                + ".api.metlife.com/claimServices/api/v1/claims/" 
                + data.get("ClaimNumber")
                + "/overpayments/"
                + ((Map)data.get("PAYMENTS")).get("NUMBER");
                
        }catch(Exception e) {
            LOGGER.error("getOverpayments_Self()::"+e.getMessage(), e);
        }
        return strReturnVal;
    }
    ```
    - The method must return `String` and it will get the entire `data` Map as input. Hence in case you need any specific data it can be added to the `data` map manually before calling `createMapping`  
        

### Concat Multiple Data Elements
- In case a response field is a concatenation of more than one data element then following can be used to concat multiple elements.
- Set the following details
    - `type` : `concat`
    - `columnName` : List of columns which needs to be concatenated.
    - `separator` : Specify the seperator using which the elements will be concatenated.
     
- Configuration

    ``` json
    {
      "field": "policyNumber",
      "tableName": "account",
      "type": "concat",
      "separator": "-",
      "columnName": "a.eno,a.gno",
      "dtype": "string"
    }
    ```
    
- Sample Output

    ```json
    {
      "policyNumber":"32343-32234324"
    }
    
    ```
    
### HBase Array to JSON Element     


### HBase Column to JSON Array

### Enumeration

### Transformation

- `trim`  : Trim white spaces
- `lower` : Convert String to Lowercase
- `upper` : Convert String to Uppercase