<template>
  <transition name="fade">
    <div class="menu-modal-background" @click="$emit('close')">
      <section class="menu-modal">
        <div class="menu-modal-title flex">
          <span class="trello-icon"></span>
          <h2>Trello DSW 2023.1</h2>
        </div>
        <router-link v-if="$route.name !== 'board-list'" to="/board"
          ><span class="board-icon"></span>Quadros</router-link
        >
      </section>
    </div>
  </transition>
</template>
