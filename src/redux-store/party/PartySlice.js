import { createSlice } from "@reduxjs/toolkit";

const PartySlice = createSlice({
  name: "Party",
  initialState: {
    characterSpriteDesign: {},
    characterSpritePreview: null,
    member1CharacterData: {},
    member2CharacterData: {},
    member3CharacterData: {},
    member4CharacterData: {},
  },
  reducers: {
    setCharacterSpriteDesign(state, action) {
      state.characterSpriteDesign = action.payload;
    },
    setCharacterSpritePreview(state, action) {
      state.characterSpritePreview = action.payload;
    },
    setMember1CharacterData(state, action) {
      state.member1CharacterData = action.payload;
    },
    setMember2CharacterData(state, action) {
      state.member2CharacterData = action.payload;
    },
    setMember3CharacterData(state, action) {
      state.member3CharacterData = action.payload;
    },
    setMember4CharacterData(state, action) {
      state.member4CharacterData = action.payload;
    },
    updateCharacterCreatorAppearance(state, action) {},
  },
});

export const {
  setCharacterSpriteDesign,
  setCharacterSpritePreview,
  setMember1CharacterData,
  setMember2CharacterData,
  setMember3CharacterData,
  setMember4CharacterData,
} = PartySlice.actions;
export default PartySlice.reducer;
