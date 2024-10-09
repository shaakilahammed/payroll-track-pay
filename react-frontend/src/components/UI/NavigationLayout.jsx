"use client";
import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loader from "./Loader";
import useAuthCheck from "@/redux/hooks/useAuthCheck";
import useAuth from "@/redux/hooks/useAuth";

const NavigationLayout = ({ child }) => {
  const currentPath = usePathname();
  const [shortMenu, setShortMenu] = useState(false);
  const toggleShortMenu = () => {
    setShortMenu((prev) => !prev);
  };
  const router = useRouter();
  const isLoggedIn = useAuth();

  useEffect(() => {
    !isLoggedIn && router.push("/login");
  }, [isLoggedIn, router]);

  let content;
  if (currentPath === "/") content = child;
  if (currentPath !== "/")
    content = (
      <>
        <Navbar shortMenu={shortMenu} />
        <div className={`main ${shortMenu && "active"}`}>
          <Header toggleShortMenu={toggleShortMenu} />
          {child}
          <Footer />
        </div>
      </>
    );
  const authChecked = useAuthCheck();

  return !authChecked ? <Loader /> : <div className="container">{content}</div>;
};

export default NavigationLayout;
