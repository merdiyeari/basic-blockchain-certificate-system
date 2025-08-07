const contractAddress = "0xC0c667BC8D59E521b5aF0022A7CD2CAB04a437Bf";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_studentName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_grade",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_courseName",
				"type": "string"
			}
		],
		"name": "addCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "issueDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "grade",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getCertificate",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;
let userAccount;

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('saveCertificate').addEventListener('click', saveCertificate);
document.getElementById('queryCertificate').addEventListener('click', queryCertificate);

async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            document.getElementById('walletAddress').textContent = 
                `Bağlı Cüzdan: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
            
            contract = new web3.eth.Contract(contractABI, contractAddress);
            
        } catch (error) {
            console.error("Bağlantı hatası:", error);
            alert("MetaMask bağlantısı başarısız!");
        }
    } else {
        alert("Lütfen MetaMask yükleyin!");
    }
}

async function saveCertificate() {
    const certId = document.getElementById('certId').value;
    const studentName = document.getElementById('studentName').value;
    const grade = document.getElementById('grade').value;
    const courseName = document.getElementById('courseName').value;
    const statusElement = document.getElementById('saveStatus');
    
    if (!certId || !studentName || !grade || !courseName) {
        statusElement.textContent = "Tüm alanları doldurun!";
        statusElement.style.color = "red";
        return;
    }
    
    try {
        statusElement.textContent = "Blockchain'e kaydediliyor...";
        statusElement.style.color = "blue";
        
        await contract.methods.addCertificate(
            certId,
            studentName,
            grade,
            courseName
        ).send({ from: userAccount });
        
        statusElement.textContent = `Sertifika başarıyla kaydedildi! (ID: ${certId})`;
        statusElement.style.color = "green";
        
        // Alanları temizle
        document.getElementById('certId').value = '';
        document.getElementById('studentName').value = '';
        document.getElementById('grade').value = '';
        document.getElementById('courseName').value = '';
        
    } catch (error) {
        console.error("Kayıt hatası:", error);
        statusElement.textContent = "Hata: " + error.message;
        statusElement.style.color = "red";
    }
}

async function queryCertificate() {
    const certId = document.getElementById('queryId').value;
    const resultDiv = document.getElementById('result');
    
    if (!certId) {
        resultDiv.innerHTML = '<p style="color:red;">Lütfen bir sertifika ID girin</p>';
        return;
    }
    
    try {
        resultDiv.innerHTML = '<p>Sorgulanıyor...</p>';
        
        const cert = await contract.methods.getCertificate(certId).call();
        
        resultDiv.innerHTML = `
            <h3>Sertifika Detayları (ID: ${certId})</h3>
            <p><strong>Öğrenci Adı:</strong> ${cert[0]}</p>
            <p><strong>Veriliş Tarihi:</strong> ${new Date(cert[1] * 1000).toLocaleString()}</p>
            <p><strong>Not:</strong> ${cert[2]}</p>
            <p><strong>Kurs Adı:</strong> ${cert[3]}</p>
        `;
        
    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">ID: ${certId} ile eşleşen sertifika bulunamadı</p>`;
    }
}