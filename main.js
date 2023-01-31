// span de error
const spanError = document.getElementById('error')
// boton del programa
const button = document.getElementById('buttonPet');

// Url API
const urlAPIRandom = 'https://api.thedogapi.com/v1/images/search?limit=2';
const urlAPI_Favorites = 'https://api.thedogapi.com/v1/favourites?';
const urlAPI_Favorites_Delete = (id)=> `https://api.thedogapi.com/v1/favourites/${id}`;
const API_KEY = 'live_4wjFN6rm3e68JSzar4ueIeeu8kEHpmMhl0y3RtPO0YGrNAx9QYFcEBvwwFRG4GOk'
const urlAPI_UPLOAD = 'https://api.thedogapi.com/v1/images/upload'

//creando una instancia con axios
const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1/'
})
// alterando la instancia
api.defaults.headers.common['X-API-KEY'] = API_KEY;

// Cargando photos randoms de gatos
async function loadRandomDogs() {
    const res = await fetch(urlAPIRandom)
    const data = await res.json()
    console.log('Random');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
      } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = ()=> saveFavouriteDogs(data[0].id);
        btn2.onclick = ()=> saveFavouriteDogs(data[1].id);
      }
}

// Cargando photo Favorito de perros
async function loadFavoriteDogs() {
    const respuesta	 = await fetch(urlAPI_Favorites, {
        method: 'GET',
        headers:{
            'X-API-KEY': API_KEY,
        }
    })
    const data = await respuesta.json()
    console.log('Favoritos');
    console.log(data);
    
    if (respuesta.status !== 200) {
        spanError.innerHTML = "Hubo un error" + respuesta.status + data.message;
    } else {
        const section = document.getElementById('favoriteDogs')
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Perrito Favorito');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(perrito => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnTxt = document.createTextNode('Sacar al perrito de favoritos');

            btn.appendChild(btnTxt);
            btn.onclick = ()=> deleteFavoriteDog(perrito.id);
            img.src = perrito.image.url;
            img.width = 150;

            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article)
        });
    }
}

// guardar Foto favorita
async function saveFavouriteDogs(id) {
    const {data, status} = await api.post('/favourites',{
        image_id: id,
    })

    //const respuesta = await fetch(urlAPI_Favorites, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json', /*Aqui le decimos al Backend en que lenguage estamos hablando, el lenguaje es json. */
    //         'X-API-KEY': API_KEY,
    //     },
    //     body: JSON.stringify({ /*Aquí le indicamos que el objeto lo convierta en cadena de texto */
    //         image_id: id,
    //     }),
    // });
    // const data = await respuesta.json();

    console.log('Save');

    if (status !== 200) {
        spanError.innerHTML = "Hubo un error" + status + data.message;
    } else {
        console.log('Foto guardado en favoritos');
        loadFavoriteDogs()
    }
}

// borrar foto de favoritos
async function deleteFavoriteDog(id) {
    const respuesta = await fetch(urlAPI_Favorites_Delete(id), {
        method: 'DELETE',
        headers:{
            'X-API-KEY': API_KEY,
        }
    });
    const data = await respuesta.json();

    if (respuesta.status !== 200) {
        spanError.innerHTML = "Hubo un error" + respuesta.status + data.message;
    } else {
        console.log('Foto eliminado de favoritos');
        loadFavoriteDogs();
    }
}

// Subir Foto de un perro
async function uploadPerritoPhoto() {
    const form = document.getElementById('uploadingForm'); //haciendo un llamado al id del formulario
    const formData = new FormData(form); // Creando una instancia del prototipo FormData() enviandole como argumento la variable form

    console.log(formData.get('file'));

    const res = await fetch(urlAPI_UPLOAD, {
        method: 'POST',
        headers:{
            'X-API-KEY': API_KEY,
        },
        body: formData,
    });
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`
    } else {
        console.log('Foto de Perrito subida');
        console.log({data});
        console.log(data.url);
        saveFavouriteDogs(data.id) //para agregar el perro cargado a favoritos
    }
}

//Eventos click
button.addEventListener('click', loadRandomDogs);


loadRandomDogs()
loadFavoriteDogs()