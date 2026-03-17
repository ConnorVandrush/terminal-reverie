import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ------------------------------------------------ */
/* ASYNC SPRITE RECOLOR                             */
/* ------------------------------------------------ */

export const recolorSprite = createAsyncThunk(
    "createCharacter/recolorSprite",
    async (option, { getState }) =>
    {
        const state = getState().createCharacter;

        let img = state.img; // current character sprite (base64)
        if (!img) 
        {
            console.log("No base sprite found. Using default.");
            img = "/img/characters/$grasslandswarriormalehair1style1.png"; // default sprite
        }

        const template = state.origin + state.job + state.gender + state.hairStyle + state.clothingStyle; // e.g. "grasslandswarriormalehair1style1"
        
        let color;
        switch (option)
        {
            case "hair":
                color = state.hairColor;
                break;
            case "eyes":
                color = state.eyeColor;
                break;
            case "skin":
                color = state.skinColor;
                break;
            case "shirt":
                color = state.shirtColor;
                break;
            case "pants":
                color = state.pantsColor;
                break;
            default:
                throw new Error(`Unknown option: ${option}`);
        }

        console.log(`Recoloring ${option} with color:`, color);
        const result = await window.clientGlobalManager.spriteColorer.recolorSprite(
            img,
            template,
            option,
            color
        );

        return result; // base64 sprite
    }
);

export const newSpriteTemplate = createAsyncThunk(
    "createCharacter/newSpriteTemplate",
    async (_, { getState }) => {
        const state = getState().createCharacter;
        const template = state.origin + state.job + state.gender + state.hairStyle + state.clothingStyle;
        const imgPath = `/img/characters/$${template}.png`;

        console.log("Generating new sprite template with:", { template, imgPath });

        // Convert image path to base64
        const base64 = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // needed for canvas -> base64
            img.src = imgPath;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };

            img.onerror = (err) => reject(err);
        });

        return base64; // now you can store this in Redux
    }
);

/* ------------------------------------------------ */
/* SLICE                                            */
/* ------------------------------------------------ */

const createCharacterSlice = createSlice({
    name: "createCharacter",

    initialState:
    {
        name: "",
        origin: "grasslands",
        job: "warrior",
        gender: "male",
        hairStyle: "hair1",
        clothingStyle: "style1",
        hairColor: "blonde",
        eyeColor: "blue",
        skinColor: "rosy",
        shirtColor: "green",
        pantsColor: "green",
        img: false
    },

    reducers:
    {
        setName: (state, action) =>
        {
            state.name = action.payload;
        },

        setOrigin: (state, action) =>
        {
            state.origin = action.payload;
        },

        setJob: (state, action) =>
        {
            state.job = action.payload;
        },

        setGender: (state, action) =>
        {
            state.gender = action.payload;
        },

        setHairStyle: (state, action) =>
        {
            state.hairStyle = action.payload;
        },

        setClothingStyle: (state, action) =>
        {
            state.clothingStyle = action.payload;
        },

        setHairColor: (state, action) =>
        {
            state.hairColor = action.payload;
        },

        setEyeColor: (state, action) =>
        {
            state.eyeColor = action.payload;
        },

        setSkinColor: (state, action) =>
        {
            state.skinColor = action.payload;
        },

        setShirtColor: (state, action) =>
        {
            state.shirtColor = action.payload;
        },

        setPantsColor: (state, action) =>
        {
            state.pantsColor = action.payload;
        },

        setImg: (state, action) =>
        {
            state.img = action.payload;
        }
    },

    extraReducers: (builder) =>
    {
        builder.addCase(recolorSprite.fulfilled, (state, action) =>
        {
            state.img = action.payload;
        });

        builder.addCase(newSpriteTemplate.fulfilled, (state, action) =>
        {
            state.img = action.payload;
            const template = state.origin + state.job + state.gender + state.hairStyle + state.clothingStyle; // e.g. "grasslandswarriormalehair1style1"
            const defaultColors = window.clientGlobalManager.spriteColorer.defaultColors.get(template) || {};
            state.hairColor = defaultColors.hair || state.hairColor;
            state.eyeColor = defaultColors.eyes || state.eyeColor;
            state.skinColor = defaultColors.skin || state.skinColor;
            state.shirtColor = defaultColors.shirt || state.shirtColor;
            state.pantsColor = defaultColors.pants || state.pantsColor;
        });
    }
});

/* ------------------------------------------------ */
/* EXPORTS                                          */
/* ------------------------------------------------ */

export const {
    setName,
    setOrigin,
    setJob,
    setGender,
    setHairStyle,
    setClothingStyle,
    setHairColor,
    setEyeColor,
    setSkinColor,
    setShirtColor,
    setPantsColor,
    setImg
} = createCharacterSlice.actions;

export default createCharacterSlice.reducer;