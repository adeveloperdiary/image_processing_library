# HBase Data Retrieval

!!! abstract
    The Framework uses the HBase Data Load Configurations in order to load the data from HBase.


- The Configuration need to be defined in the `tables` section.
- `queryName` : Needs to be specified to specific Titan Query, so that the `vid` will be used to fetch the data from HBase. 
- `columns` :  List of the HBase column name with column family name.
- `variableName` : This is optional attribute. In case in the previous Titan Query, a `select` has been used to get `vid` from multiple Entity, the `variableName` attribute can be used to get the associated `vid`s. (Example has been provided below)

Sample Configuration

!!! example "Single Table"
    ```json
    "tables": {
        "T_CLM_PY": {
          "queryName": "claimPayment",
          "columns": [
            "b.N_PY_PERIODS"
          ]
        }
      }
    ```

!!! example "Multiple Tables and Titan Query"

    ```json
    "tables": {
        "T_CLM_PY": {
          "queryName": "claimPayment",
          "columns": [
            "b.PY_ADJUSTMENTS"
          ]
        },
        "T_DABL_PLN": {
          "queryName": "planDetails",
          "columns": [
            "c.BEN_ADJ_AMT_MODE_CD"
          ]
        }
    }
    ```

!!! danger "Multiple Tables but one Titan Query"
    - Generally we use `select` to get all different Entities from one Titan Query.
    - Here is an example of that
    
    ```json
    ...
    {
        "ops": "select",
        "attr": "AbsenceRequest,Member,ContactMethod,Customer"
    }
    ...
    ```
    
    - Now, in order to get the HBase data from all the above entites we need to specify the `variableName` ( Which is the same as values provided in the `attr` ) in the configuration.
    - As we can see below, the `variableName` was defined for each Entity. 
    
    ```json
    "tables": {
        "T_ABS_REQ": {
          "queryName": "absenceRequest",
          "variableName": "AbsenceRequest",
          "columns": [
            "b.ABS_NUM_CD",
            "c.ABS_REQ_STTS_CD",
            "b.ABS_NUM_CD",
            "c.CVR_CD",
            "c.ABS_STRT_DT",
            "c.ABS_REQ_TYPES",
            "c.CONT_INTMT_HIST_CD"
          ]
        },
        "T_GRP_MBR": {
          "queryName": "absenceRequest",
          "variableName": "Member",
          "columns": [
            "b.FRST_NM",
            "b.LST_NM",
            "b.MID_1_NM",
            "b.SFX_OF_NM"
          ]
        },
        "T_CNTCT_MTHD": {
          "queryName": "absenceRequest",
          "variableName": "ContactMethod",
          "columns": [
            "b.ADR_1_LN",
            "b.ADR_2_LN",
            "b.CITY_NM",
            "b.ST_CD",
            "e.ZIP_CD",
            "b.SRC_SYS_NM",
            "b.PERM_ADR_IND"
          ]
        },
        "T_GRP_CUST": {
          "queryName": "absenceRequest",
          "variableName": "Customer",
          "columns": [
            "b.CUST_NM"
          ]
        }
    }
    ```

