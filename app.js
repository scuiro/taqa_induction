const axios = require('axios');
const express = require('express');

const app = express();
const port = 8082;

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

  if(!cin || !firstname || !lastname || !company){
    res.status(200).json({code: "001", message: "Données obligatoires manquant"});
  }

  const url = `${END_POINT_BASE_URL}guest/new`;
  const token = await login(); 

  try {
      // Send Request 
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        }
      });
      // return response 
      return res.status(200).json({code: "000", message: "Votre demande a bien été traité"});
    } catch (error) {
      // return response error 
      return res.status(200).json({code: "005", message: "Erreur lors du traitement de votre demande"});
    }
}

app.post("/api/new-request", async(req, res)=> {
  return await sendPostRequest(req.body, req, res);
});

app.post('/api/get-induction-result', async (req, res) => {
    const { identityNumber } = req.body;

    if (!identityNumber) {
      return res.status(200).json({ code: "001", message: 'Numéro de pièce d\'identité obligatoire'});
    }

    try {
      //  Call to induction result function 
      const result = await getInductionResult(identityNumber);
      if(result.data.certification_statut){
        return res.status(200).json({code: "000", message: "", status: result.data.certification_statut.toUpperCase()})
      }else{
        return res.status(200).json({code: "000", message: "", status: "NOT_FOUND"})
      }
    } catch (error) {
      return res.status(200).json({code: "000", message: "", status: "NOT_FOUND"})
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});