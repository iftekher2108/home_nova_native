
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

export const registerUser = async ({
  fullName,
  email,
  password,
  phoneNumber = null,
}) => {
  try {
    // 1. Create Firebase Authentication user
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = credential.user;

    // 2. Update Auth profile
    await updateProfile(user, {
      displayName: fullName,
    });

    // 3. Create Firestore user document
    const userData = {
      uid: user.uid,
      fullName: fullName.trim(),
      email: user.email,
      phoneNumber,
      photoPath: null,
      authProvider: "password",
      emailVerified: user.emailVerified,
      accountStatus: "active",
      defaultFamilyId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      deletedAt: null,
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return {
      success: true,
      uid: user.uid,
      message: "Registration successful",
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
