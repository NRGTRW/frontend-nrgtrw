document.addEventListener("DOMContentLoaded", () => {
  const cubes = document.querySelectorAll(
    ".cube-container, .spinner1, .spinner2, .spinner3"
  );

  // Adding event listeners to elements with class selectors
  cubes.forEach((cube) => {
    cube.addEventListener("click", () => {
      const animatedElement = cube.querySelector(".cube, .cube-loader") || cube;

      if (animatedElement.style.animationPlayState === "paused") {
        animatedElement.style.animationPlayState = "running";
      } else {
        animatedElement.style.animationPlayState = "paused";
      }
    });
  });

  // Adding event listeners to elements with specific IDs
  const gradientCubes = ["gradientCube1", "gradientCube2", "gradientCube3"];
  gradientCubes.forEach((id) => {
    const cube = document.getElementById(id);
    if (cube) {
      cube.addEventListener("click", () => {
        if (cube.style.animationPlayState === "paused") {
          cube.style.animationPlayState = "running";
        } else {
          cube.style.animationPlayState = "paused";
        }
      });
    }
  });
});
