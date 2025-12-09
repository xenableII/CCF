// ===== IMPORTATION DES MODULES ===== 
const express  = require("express");           
// Framework web léger pour Node.js 
const cors  = require("cors");                 
const sqlite3 = require("sqlite3").verbose(); // Module SQLite pour Node.js avec logs activés 
const bodyParser = require("body-parser");    // Middleware pour parser le corps des requêtes HTTP 
const path  = require("path"); 


// ===== INITIALISATION DE L'APPLICATION ===== 
const app = express(); 

// ===== MIDDLEWARES ===== 
app.use(cors())   ;
app.use(bodyParser.json()) ;

// Middleware pour gérer les requêtes cross-origin 
// Module pour gérer les chemins de fichiers 
// Autoriser toutes les requêtes provenant d'autres domaines 
// Parse le corps des requêtes JSON 
app.use(bodyParser.urlencoded({ extended: true })); // Parse les formulaires (application/x-www-formurlencoded) 

// ===== SERVIR LES FICHIERS STATIQUES ===== 
app.use(express.static(path.join(__dirname, "public"))); // Permet d'accéder à public/index.html 

// ===== CONNEXION À SQLITE ===== 
const db = new sqlite3.Database("carrefour.db", (err) => { 
if (err)  
console.error("Erreur connexion SQLite :", err.message); // Affiche erreur de connexion 
else 
console.log("SQLite OK."); // Sinon, confirme la connexion 
}); 


// ===== API : RECHERCHER UN ARTICLE PAR CODE BARRES ===== 
app.post("/api/article", (req, res) => { 
    // Vérification que le corps de la requête contient bien le code-barres 
    if (!req.body.codeBarre)  
    { 
    return res.json({ message: "codeBarre missing!"  }); 
    } 
    const codeBarre = req.body.codeBarre; // Récupération du code-barres envoyé par le front
    // Requête SQLite sécurisée pour récupérer l'article correspondant 
    db.get( 
    "SELECT * FROM articles WHERE codeBarre = ?", // ? = placeholder, requête sécurisée 
    [codeBarre], 
    (err, row) => { 
    if (err) { 
    // Gestion des erreurs SQLite 
    return res.json({ message: "Erreur SQLite : " + err.message }); 
    } 
    if (!row) { 
    // Aucun article trouvé pour ce code-barres 
    return res.json({ message: "Aucun article trouvé." }); 
    } 
    // Article trouvé → renvoyer l'objet article au format JSON 
    res.json({ message: "OK", results: row }); 
    } 
    ); 
});

// ===== LANCER LE SERVEUR ===== 
const PORT = process.env.PORT || 8080; // 8080 en local, sinon port choisi par hébergeur  
app.listen(PORT, () =>  
{ 
console.log("Serveur Node.js démarré sur http://localhost:" + PORT); 
}); 