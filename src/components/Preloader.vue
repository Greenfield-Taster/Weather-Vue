<template>
  <div class="preloader">
    <img
      src="../assets/background.jpg"
      alt="Background"
      class="background-image"
    />
    <img class="loadCircle" src="../assets/load.gif" />
  </div>
</template>
<script setup></script>
<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
  opacity: 0.3;

  background-repeat: no-repeat;
  background-size: cover;
}
.loadCircle {
  width: 100px;
}
</style>
