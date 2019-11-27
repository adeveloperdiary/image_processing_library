#Input Validation

##Currently Supported Features:​
* Automated Parameter Validation Error​
* Multiple scenarios​
* Default Values​
* Optional Parameters​
* Filters unwanted parameters​ ( or allow all parameters)
* RSQL​
* URL Path Parameters​
* HTTP Request Parameters​
* Control Parameters​
* Sorting​
* Limit​
* Offsets​

##JSON Configuration

###Define Scenarios
* There could be more than one search scenario supported by the API.
* Define each scenario here so that
    * Specific scenario will be selected based on input parameters.  
    * The validation will work on selected scenario.
    
``` json
"requestparam_Validation": {
    "scenario_1": {
      "parameters": [
        {
      
        }
      ],
      "control": [
      
      ]
    },
    "scenario_2": {
      "parameters": [
        {
      
        }
      ],
      "control": [
      
      ]
    }
  }
```
    
###Define Parameters for specific scenario

* You can define two types of parameters.

#### Request Parameters
* All the available parameters such as HTTP Request Parameters, RSQL etc will be added to the common Map object and will be available for validation.

``` json
"parameters": [
    {
      "name": "claimNumber",
      "operator": "==",
      "required": "Yes"
    }
  ]
```


#### Control Parameters

``` json
"control": [
    {
      "limit": "20",
      "offset": "0",
      "sort": ""
    }
  ]
```

##Java Code


``` java

class <BusinessLayer>{

    @Autowired
    EOSAPIFramework eosAPIFramework;
    
    public ResponseEntity<String> get<Function>(Map<String, String> requestParams
            ,Map<String, String> pathParams) {    
        
        ...
        
        EOSAPIFrameworkRequest eosapiFrameworkRequest= 
            eosAPIFramework
            .rsqlParameterValidator
            .validateRSQLParameters(requestParams,pathParams,jsonConfig);
            
        ...
    }
}

```