import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ------------------------------------------------ */
/* ASYNC SPRITE RECOLOR                             */
/* ------------------------------------------------ */

export const recolorHair = createAsyncThunk(
    "createCharacter/recolorHair",
    async (_, { getState }) =>
    {
        const state = getState().createCharacter;

        console.log("Recoloring hair with color:", state.hairColor);
        const result = await window.clientGlobalManager.spriteColorer.recolorSprite(
            "/img/characters/$Grasslander.png",
            "grasslandswarriormalehair1style1",
            "hair",
            { r:255, g:0, b:0 },   // primary hair color
            { r:0, g:0, b:0 }      // secondary hair color
        );
        console.log("Recolor result:", result);

        return result; // base64 sprite
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
        hairStyle: "1",
        clothingStyle: "1",
        hairColor: "blonde",
        eyeColor: "blue",
        skinColor: "rosy",
        shirtColor: "green",
        pantsColor: "green",
        img: null
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
        }
    },

    extraReducers: (builder) =>
    {
        builder.addCase(recolorHair.fulfilled, (state, action) =>
        {
            state.img = action.payload;
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
    setPantsColor
} = createCharacterSlice.actions;

export default createCharacterSlice.reducer;