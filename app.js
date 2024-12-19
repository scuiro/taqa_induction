const axios = require('axios');
const express = require('express');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const app = express();
const port = 8082 ;

app.use(express.json());

let END_POINT_BASE_URL= "https://inductionhse.taqamorocco.ma/api/";
let USERNAME="api@induction2023";
let PASSWORD="taqa@induction2023";

async function login() {
  try {
    const response = await axios.post(END_POINT_BASE_URL + 'login_check', {
      username: USERNAME,
      password: PASSWORD
    }, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data.token;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

async function getInductionResult(identityNumber) {
  const url = `${END_POINT_BASE_URL}guest/${identityNumber}/result`;
  const token = await login(); 

  try {
      const response = await axios.get(url, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json',
          }
      });

      return response.data;
  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  }
}

async function sendPostRequest(payload, req, res){
  const { cin, lastname, firstname, email, phone, company } = payload;

  console.log("===========================================================>");
  console.log("Starting Init Induction for Users");
  console.log("CIN: " + cin);
  console.log("LastName: " + lastname);
  console.log("FirstName: " + firstname);
  console.log("Email: " + email); 
  console.log("Phone: " + phone);
  console.log("Company: " + company);

  if(!cin || !firstname || !lastname || !company){
    res.status(200).json({code: "001", message: "Données obligatoires manquant"});
  }

  const url = `${END_POINT_BASE_URL}guest/new`;
  const token = await login(); 

  console.log("Result: ============================>" );

  try {
      // Send Request 
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        }
      });
      console.log({code: "000", message: "Votre demande a bien été traité"});
      // return response 
      return res.status(200).json({code: "000", message: "Votre demande a bien été traité"});
    } catch (error) {
      console.log({code: "005", message: "Erreur lors du traitement de votre demande"});
      // return response error 
      return res.status(200).json({code: "005", message: "Erreur lors du traitement de votre demande"});
    }
}

function isExpirationLessThan7Days(expirationDateStr) {
  // Convert the expiration date string to a Date object
  const expirationDate   = new Date(expirationDateStr);
  
  // Get the current date
  const currentDate      = new Date();
  
  // Calculate the date 7 days from now
  const sevenDaysFromNow = new Date();

  sevenDaysFromNow.setDate(currentDate.getDate() + 7);
  
  // Return true if the expiration date is more than 7 days away
  return expirationDate < sevenDaysFromNow;
}

app.post("/api/new-request", async(req, res)=> {
  return await sendPostRequest(req.body, req, res);
});

app.post('/api/get-induction-result', async (req, res) => {
    const { identityNumber } = req.body;
    console.log("===========================================================>");
    console.log("Getting Induction Result For : ");
    console.log("CIN: " + identityNumber); 

    if (!identityNumber) {
      return res.status(200).json({ code: "001", message: 'Numéro de pièce d\'identité obligatoire'});
    }

    console.log("Result For This Request =======================>");
    try {
      
      //  Call to induction result function 
      const result = await getInductionResult(identityNumber);

      // Check If Ceritification Status is found 
      if(result.data.certification_statut){

        // Extract Expiration From the response 
        let expirationDate = result.data.certification_expiration_date;
        let status         = result.data.certification_statut.toUpperCase();
        
        // Check If Expiration Date is less the 7 days 
        if(isExpirationLessThan7Days(expirationDate)){
          status           = "SOON_EXPIRED";
        }

        // Return Response 
        return res.status(200).json({
          code: "000", 
          message: "", 
          status: status,
        });

      }else{
        // Answer as not found 
        return res.status(200).json({code: "000", message: "", status: "NOT_FOUND"})
      }
    } catch (error) {
      console.log("Error Occured ============================>")
      console.log(error);
      return res.status(200).json({code: "000", message: "", status: "NOT_FOUND"})
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});