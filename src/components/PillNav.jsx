import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const PillNav = (
  {
    user,
    logout,
    logo,
    logoAlt = "Logo",
    items,
    activeHref,
    className = "",
    ease = "power3.easeOut",
    baseColor = "#fff",
    pillColor = "#060010",
    hoveredPillTextColor = "#060010",
    pillTextColor,
    onMobileMenuClick,
    initialLoadAnimation = true,
  },
  props
) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State to manage user dropdown visibility on click for mobile/tablet
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);
  const userMenuRef = useRef(null); // Ref for the user menu to detect outside clicks

  // Effect to handle clicks outside the user menu on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, { scale: 1, duration: 0.6, ease });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, { width: "auto", duration: 0.6, ease });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: "top center",
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: "top center",
          onComplete: () => gsap.set(menu, { visibility: "hidden" }),
        });
      }
    }
    onMobileMenuClick?.();
  };

  const isExternalLink = (href) =>
    href.startsWith("http") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");
  const isRouterLink = (href) => href && !isExternalLink(href);

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
    ["--nav-h"]: "42px",
    ["--logo"]: "36px",
    ["--pill-pad-x"]: "18px",
    ["--pill-gap"]: "3px",
  };

  const LogoComponent = () =>
    isRouterLink(items?.[0]?.href) ? (
      <Link
        to={items[0].href}
        aria-label="Home"
        onMouseEnter={handleLogoEnter}
        role="menuitem"
        ref={logoRef}
        className="rounded-full inline-flex items-center justify-center overflow-hidden"
        style={{
          width: "var(--nav-h)",
          height: "var(--nav-h)",
          background: "var(--base, #000)",
        }}
      >
        <img
          src={logo}
          alt={logoAlt}
          ref={logoImgRef}
          className="w-full h-full object-cover block"
        />
      </Link>
    ) : (
      <a
        href={items?.[0]?.href || "#"}
        aria-label="Home"
        onMouseEnter={handleLogoEnter}
        ref={logoRef}
        className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
        style={{
          width: "var(--nav-h)",
          height: "var(--nav-h)",
          background: "var(--base, #000)",
        }}
      >
        <img
          src={logo}
          alt={logoAlt}
          ref={logoImgRef}
          className="w-full h-full object-cover block"
        />
      </a>
    );

  return (
    <div
      className={`absolute top-3 left-0 w-full z-[1000] px-4 py-3 ${className}`}
      style={cssVars}
    >
      <nav
        className="w-full flex items-center justify-between"
        aria-label="Primary"
      >
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <LogoComponent />
          <div
            ref={navItemsRef}
            className="relative items-center rounded-full hidden md:flex"
            style={{ height: "var(--nav-h)", background: "var(--base, #000)" }}
          >
            <ul
              role="menubar"
              className="list-none flex items-stretch m-0 p-[3px] h-full"
              style={{ gap: "var(--pill-gap)" }}
            >
              {items.map((item, i) => {
                const isActive = activeHref === item.href;
                const pillStyle = {
                  background: "var(--pill-bg, #fff)",
                  color: "var(--pill-text, var(--base, #000))",
                  paddingLeft: "var(--pill-pad-x)",
                  paddingRight: "var(--pill-pad-x)",
                };
                const PillContent = (
                  <>
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                      style={{
                        background: "var(--base, #000)",
                        willChange: "transform",
                      }}
                      aria-hidden="true"
                      ref={(el) => (circleRefs.current[i] = el)}
                    />
                    <span className="label-stack relative inline-block leading-[1] z-[2]">
                      <span
                        className="pill-label relative z-[2] inline-block leading-[1]"
                        style={{ willChange: "transform" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                        style={{
                          color: "var(--hover-text, #fff)",
                          willChange: "transform, opacity",
                        }}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>
                    {isActive && (
                      <span
                        className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                        style={{ background: "var(--base, #000)" }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                );
                const basePillClasses =
                  "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0";
                return (
                  <li key={item.href} role="none" className="flex h-full">
                    {isRouterLink(item.href) ? (
                      <Link
                        role="menuitem"
                        to={item.href}
                        className={basePillClasses}
                        style={pillStyle}
                        aria-label={item.ariaLabel || item.label}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                      >
                        {PillContent}
                      </Link>
                    ) : (
                      <a
                        role="menuitem"
                        href={item.href}
                        className={basePillClasses}
                        style={pillStyle}
                        aria-label={item.ariaLabel || item.label}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                      >
                        {PillContent}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user && (
            <div ref={userMenuRef} className="relative group flex-shrink-0">
              <img
                src={user.picture || user.avatar_url}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                referrerPolicy="no-referrer"
                onClick={() => setIsUserMenuOpen((prev) => !prev)} // Toggle on click for mobile
              />
              <div
                className={`absolute top-full right-0 mt-2 w-max p-3 rounded-xl shadow-xl 
                           bg-white/10 backdrop-blur-lg text-white
                           origin-top-right flex flex-col items-start gap-1 transition-all duration-200
                           ${
                             isUserMenuOpen
                               ? "opacity-100 visible scale-100"
                               : "opacity-0 invisible scale-95"
                           }
                           lg:opacity-0 lg:invisible lg:scale-95 
                           lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:scale-100`}
              >
                <span className="font-bold text-sm px-1">{user.name}</span>
                {user.email && (
                  <span className="text-xs text-gray-300 px-1">
                    {user.email}
                  </span>
                )}
                {/* {logout && ( */}
                {user && (
                  <div className="w-full border-t border-white/20 mt-2 pt-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-start gap-2 px-2 py-1.5 text-md font-semibold text-red-500 bg-transparent hover:text-white hover:bg-red-700 rounded-md transition-colors"
                    >
                      <svg
                        className="w-5 h-5" // Use Tailwind classes for sizing
                        fill="currentColor" // Inherit the white text color
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 511.989 511.989"
                        xmlSpace="preserve"
                      >
                        <g>
                          <g>
                            <g>
                              <path d="M110.933,221.782c-4.71,0-8.533,3.823-8.533,8.533v51.2 c0,4.71,3.823,8.533,8.533,8.533s8.533-3.823,8.533-8.533v-51.2 C119.467,225.605,115.644,221.782,110.933,221.782z" />
                              <path d="M111.855,2.304L31.172,34.586C8.448,43,0,54.418,0,76.715v358.477c0,22.298,8.448,33.715,30.959,42.061l81.058,32.427 c4.011,1.519,8.038,2.287,11.981,2.287c17.152,0,29.602-14.336,29.602-34.091V34.049C153.6,9.78,134.246-6.126,111.855,2.304z M136.533,477.876c0,10.18-5.035,17.024-12.535,17.024c-1.869,0-3.883-0.401-5.803-1.118L37.103,461.33 c-16.102-5.965-20.036-11.102-20.036-26.138V76.715c0-15.036,3.934-20.164,20.241-26.206l80.725-32.29 c2.082-0.785,4.087-1.186,5.956-1.186c7.501,0,12.544,6.835,12.544,17.016V477.876z" />
                              <path d="M178.133,51.115h120.533c14.114,0,25.6,11.486,25.6,25.6v128c0,4.71,3.814,8.533,8.533,8.533 c4.719,0,8.533-3.823,8.533-8.533v-128c0-23.526-19.14-42.667-42.667-42.667H178.133c-4.71,0-8.533,3.823-8.533,8.533 S173.423,51.115,178.133,51.115z" />
                              <path d="M332.8,298.582c-4.719,0-8.533,3.823-8.533,8.533v128c0,14.114-11.486,25.6-25.6,25.6H179.2 c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h119.467c23.526,0,42.667-19.14,42.667-42.667v-128 C341.333,302.405,337.519,298.582,332.8,298.582z" />
                              <path d="M511.343,252.655c-0.435-1.05-1.058-1.988-1.852-2.782l-85.325-85.333c-3.337-3.336-8.73-3.336-12.066,0 c-3.337,3.337-3.337,8.73,0,12.066l70.767,70.775H196.267c-4.71,0-8.533,3.823-8.533,8.533c0,4.71,3.823,8.533,8.533,8.533 h286.601L412.1,335.215c-3.337,3.337-3.337,8.73,0,12.066c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5 l85.325-85.325c0.794-0.794,1.417-1.732,1.852-2.782C512.205,257.093,512.205,254.738,511.343,252.655z" />
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
                {/* )} */}
              </div>
            </div>
          )}
          <div className="md:hidden">
          <button
            ref={hamburgerRef}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative md:hidden"
            style={{
              width: "var(--nav-h)",
              height: "var(--nav-h)",
              background: "var(--base, #000)",
            }}
          >
            <span
              className="hamburger-line w-4 h-0.5 rounded origin-center"
              style={{ background: "var(--pill-bg, #fff)" }}
            />
            <span
              className="hamburger-line w-4 h-0.5 rounded origin-center"
              style={{ background: "var(--pill-bg, #fff)" }}
            />
          </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        ref={mobileMenuRef}
        className="z-50 md:hidden absolute top-[calc(var(--nav-h)_+_1rem)] left-4 right-4 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] origin-top"
        style={{ background: "var(--base, #f0f0f0)" }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map((item) => {
            const defaultStyle = {
              background: "var(--pill-bg, #fff)",
              color: "var(--pill-text, #fff)",
            };
            const hoverIn = (e) => {
              e.currentTarget.style.background = "var(--base)";
              e.currentTarget.style.color = "var(--hover-text, #fff)";
            };
            const hoverOut = (e) => {
              e.currentTarget.style.background = "var(--pill-bg, #fff)";
              e.currentTarget.style.color = "var(--pill-text, #fff)";
            };
            const linkClasses =
              "block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] text-center";
            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
