<template>
  <div class="badge">
    <div class="members-preview flex">
      <template v-for="member in card.members">
        <avatar
          v-if="member"
          :key="member._id"
          class="avatar-comment"
          :size="30"
          :username="member.username"
        ></avatar>
      </template>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import { userService } from "../../service/user.service";
import { deepCopy } from "../../service/util.service";

export default {
  props: {
    card: Object,
  },
  components: {
    Avatar,
  },
  computed: {
  },
};
</script>
