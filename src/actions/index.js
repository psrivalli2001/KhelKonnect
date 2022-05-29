import { auth, provider, storage} from "../firebase";
import db from "../firebase";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { doc, addDoc, getFirestore, collection, orderBy, onSnapshot, getDoc, getDocs, query } from "firebase/firestore"; 

export const setUser = (payload) => ({
    type: "SET_USER",
    user: payload,
});

export const setLoading = (status) => ({
    type: SET_LOADING_STATUS,
    status: status, 
});

export const getArticles = (payload) => (
    {
        type: GET_ARTICLES,
        payload: payload,
    }
)

export function signInAPI(){
    return (dispatch) => {
        auth
        .signInWithPopup(provider)
        .then((payload) => {
            //console.log(payload);
            dispatch(setUser(payload.user));
        })
        .catch((error) => alert(error.message));
    };
}

export function getUserAuth(){
    return (dispatch) => {
        auth.onAuthStateChanged(async (user) => {
            if(user){
                dispatch(setUser(user));
            }
        });
    };
}

export function signOutAPI() {
    return (dispatch) => {
        auth.signOut().then(()=> {dispatch(setUser(null));})
        .catch((error) =>{
            console.log(error.message);
        });
    };
}

export function postArticleAPI(payload) {
    return (dispatch) => {
        dispatch(setLoading(true))

        if(payload.image != ""){
            const uploadRef = ref(storage,`/images/${payload.image.name}`);
            const upload = uploadBytesResumable(uploadRef, payload.image)
            console.log(upload);

            upload.on("state_changed",
            (snapshot) => {
                const progress = ((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                console.log("Progress: ${progress}%");
                if(snapshot.state === "RUNNING"){
                    console.log("Progress: ${progress}%");
                }
            }, error => console.log(error.code),
            async () => {
                const downloadURL = await getDownloadURL(upload.snapshot.ref);
                const collectionRef = collection(db, "articles");
                addDoc(collectionRef,{
                    actor: {
                        description: payload.user.email,
                        title: payload.user.displayName,
                        date: payload.timestamp,
                        image: payload.user.photoURL
                    },
                    video: payload.video,
                    sharedImg: downloadURL,
                    comments: 0,
                    description: payload.description,
                });
                dispatch(setLoading(false));
            });
        } else if(payload.video){
            const collectionRef = collection(db, "articles");
            addDoc(collectionRef,{
                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: payload.timestamp,
                    image: payload.user.photoURL
                },
                video: payload.video,
                sharedImg: "",
                comments: 0,
                description: payload.description,
            });
            dispatch(setLoading(false));

        }
    };
}

export function getArticlesAPI() {
    return (async (dispatch) => {
        let payload;
        const dataRef = collection(db, "articles");
        const q = query(dataRef, orderBy("actor.date", "desc"));
        const dataSnap = await getDocs(q);
        payload = [];
        const dataArray  = dataSnap.forEach((doc) => {
            payload.push(doc.data());
        });
        //console.log(payload);
        dispatch(getArticles(payload));

    }
)}