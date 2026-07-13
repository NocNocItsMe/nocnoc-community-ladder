// =====================================
// Supabase Verbindung
// =====================================

const SUPABASE_URL =
"https://xofavibujjvayficpvwa.supabase.co";


const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZmF2aWJ1amp2YXlmaWNwdndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NDQ3MzMsImV4cCI6MjA5OTUyMDczM30.Np4RSG7CpLKImjZdMAbFComVK3eAYZ4XKOR6YRXOzig";


const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// =====================================
// Daten laden
// =====================================

let characters = [];


async function loadCharacters() {


    const { data, error } =
        await supabaseClient
        .from("characters")
        .select("*")
        .order("level", {
            ascending:false
        });



    if(error){

        console.error(error);

        return;

    }



    characters = data;


    render();

}





// =====================================
// Charakter anmelden
// =====================================

async function registerCharacter(){


    const input =
    document.getElementById(
        "characterName"
    );


    const message =
    document.getElementById(
        "message"
    );



    const name =
    input.value.trim();



    if(!name){

        message.innerHTML =
        "Bitte einen Namen eingeben.";

        return;

    }



    if(!name.startsWith("HCSSFNoc_")){


        message.innerHTML =
        "❌ Nur Charaktere mit HCSSFNoc_ erlaubt.";

        return;

    }



    const {data: existing} =
    await supabaseClient
    .from("characters")
    .select("name")
    .eq("name",name);



    if(existing.length > 0){

        message.innerHTML =
        "Dieser Charakter ist bereits registriert.";

        return;

    }




    const {error} =
    await supabaseClient
    .from("characters")
    .insert({

        name:name,

        level:0,

        class:"-",

        alive:true,

        official_rank:null

    });



    if(error){

        console.error(error);

        message.innerHTML =
        "Fehler beim Speichern.";

        return;

    }



    message.innerHTML =
    "👻 Charakter erfolgreich hinzugefügt!";


    input.value="";


    loadCharacters();


}






// =====================================
// Tabelle anzeigen
// =====================================


function render(){


const body =
document.getElementById(
    "ladderBody"
);


const search =
document.getElementById(
    "search"
)
.value
.toLowerCase();



body.innerHTML="";



const filtered =
characters.filter(
    c =>
    c.name
    .toLowerCase()
    .includes(search)
);




document.getElementById(
"memberCount"
)
.innerText =
characters.length;




filtered.forEach(
(player,index)=>{


let medal="";


if(index===0)
medal="👑";


if(index===1)
medal="💎";


if(index===2)
medal="👻";



let status =
player.alive
? "🟢"
: "💀";



body.innerHTML += `

<tr>

<td>
${medal} ${index+1}
</td>


<td>
${player.name}
</td>


<td>
${player.level || "-"}
</td>


<td>
${player.class || "-"}
</td>


<td>
${status}
</td>


<td>
${player.official_rank || "-"}
</td>


</tr>

`;



});


}





// =====================================
// Suche
// =====================================

document
.getElementById("search")
.addEventListener(
"input",
render
);





// Start

loadCharacters();