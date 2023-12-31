import { typeOf, sortByIds, deepCopy } from '../service/util.service.js';
import { boardService } from '../service/board.service.js';
import { cardService } from '../service/card.service.js';
import { getLoggedinUser } from '../service/user.service.js';

export default {
  state: {
    boards: null,
    board: null
  },
  getters: {
    boardLabels(state) { return state.board.labels },
    getBoards(state) { return state.boards },
    getBoard(state) { return state.board },
    getMembers(state) { return state.board.members },
    getActivities(state) { return state.board.activities },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    setBoard(state, { board }) {
      state.board = board;
    },
    setBoardItem(state, { item, key, boardId }) {
      if (state.board?._id === boardId)
        state.board[key] = item
    },
    setList(state, { list }) {
      const lists = state.board.lists;
      const listIdx = lists.findIndex(currList => currList.id === list.id);
      if (listIdx < 0) lists.push(list);
      else if (JSON.stringify(lists.splice(listIdx, 1, list)) !== JSON.stringify(list)) lists.splice(listIdx, 1, list);
    },
    setCard(state, { card, listId }) {
      const list = state.board.lists.find(list => list.cards.find(c => c.id === card.id)) || state.board.lists.find(list => list.id === listId);
      // let list = state.board.lists.find(list => list.cards.find(c => c.id === card.id));
      // if (!list) list = state.board.lists.find(list => list.id === listId);
      // const list = state.board.lists.find(list => list.id === listId);
      const cardIdx = list.cards.findIndex(currCard => currCard.id === card.id);
      if (cardIdx < 0) list.cards.push(card);
      else if (JSON.stringify(list.cards.splice(cardIdx, 1, card)) !== JSON.stringify(item)) list.cards.splice(cardIdx, 1, card);
    },
    setItem(state, { item, listId, cardId, key }) {
      const list = state.board.lists.find(list => list.cards.find(card => card.id === cardId)) || state.board.lists.find(list => list.id === listId);
      // let list = state.board.lists.find(list => list.cards.find(card => card.id === cardId));
      // if (!list) list = state.board.lists.find(list => list.id === listId);
      // const list = state.board.lists.find(list => list.id === listId);
      const card = list.cards.find(card => card.id === cardId);
      if (typeOf(card[key]) === 'Array' && item.id) {
        const itemIdx = card[key].findIndex(currItem => currItem.id === item.id);
        if (itemIdx < 0) card[key].push(item);
        else if (JSON.stringify(card[key][itemIdx]) !== JSON.stringify(item)) card[key].splice(itemIdx, 1, item)
      } else card[key] = item;//if (!card[key] || item === null || (typeOf(item) === typeOf(card[key]) && deepCopy(item) !== deepCopy(card[key]))) card[key] = item;
    },
    removeBoard(state, { board }) {
      const boardIdx = state.boards.findIndex(el => el.id === board._id);
      state.boards.splice(boardIdx, 1);
    },
    removeList(state, { list }) {
      const listIdx = state.board.lists.findIndex(el => el.id === list.id)
      if (listIdx > -1) state.board.lists.splice(listIdx, 1);
    },
    removeCard(state, { listId, card }) {
      const list = state.board.lists.find(el => el.id === listId);
      const cardIdx = list.cards.findIndex(el => el.id === card.id);
      if (cardIdx > -1) list.cards.splice(cardIdx, 1);
    },
    removeItem(state, { item, listId, cardId, key }) {
      const list = state.board.lists.find(el => el.id === listId);
      const card = list.cards.find(el => el.id === cardId);
      if (typeOf(card[key]) === 'Array' && item.id) {
        const itemIdx = card[key].findIndex(el => el.id === item.id);
        if (itemIdx > -1) card[key].splice(itemIdx, 1);
      } else if (typeOf(card[key] === 'Object')) card[key] = {};
      else if (typeOf(card[key] === 'Array')) card[key] = [];
      else card[key] = null;
    },
    sortBoard(state, { map }) {
      const listIds = [];
      for (const key in map) {
        listIds.push(key);
      }
      var merge = [];
      state.board.lists.forEach(list => merge = merge.concat(list.cards));
      state.board.lists = state.board.lists.map(list => {
        return {
          ...list,
          cards: sortByIds(merge.filter(card => map[list.id].includes(card.id)), map[list.id]),
        }
      });
      state.board.lists = sortByIds(state.board.lists, listIds);
    },
  },
  actions: {
    async loadBoards({ commit }) {
      try {
        const boards = await boardService.query()
        commit({ type: 'setBoards', boards })
        return boards
      } catch (err) {
        console.log('Load boards failed..', err);
      }
    },
    async getBoardById({ commit }, { boardId }) {
      try {
        const board = await boardService.getBoardById(boardId);
        commit({ type: 'setBoard', board })
        return board
      } catch (err) {
        console.log('Load board failed..', err);
      }
    },
    async createBoard({ }, { title, style }) {
      try {
        const boardId = await boardService.add(title, style)
        return boardId
      } catch (err) {
        console.log('Create board failed..', err);
      }
    },
    async removeBoard({ commit }, { board }) {
      try {
        boardService.remove(board._id);
        commit({ type: 'removeBoard', board })

      } catch (err) {
        console.log('Remove board failed..', err);
      }
    },
    async updateBoard({ }, { board }) {
      try {
        const updatedBoard = await boardService.update(board);
        return updatedBoard;
      } catch (err) {
        console.log('Update board failed..', err);
      }
    },
    // GET
    getCardById({ state }, { listId, cardId }) {
      const card = cardService.getCardById(state.board, listId, cardId)
      return card
    },
    // SET
    async setBoardItem({ state, commit, dispatch }, { item, key, boardId}) {
      try {
        boardId ??= state.board?._id;
        if (boardId === state.board?._id) {
          const save = deepCopy({ type: 'setBoardItem', item: state.board[key] || null, key, boardId });
        
          commit({ type: 'setBoardItem', item, key, boardId });
          if (!await boardService.setBoard(item, key, boardId)) commit(save);
        } else
          await boardService.setBoard(item, key, boardId);
      } catch (err) {
        console.log(err);
      }
    },
    async setList({ commit, dispatch, state }, { list}) {
      try {
        const save = deepCopy({ type: 'removeList', list});
        list = await boardService.setList(list, { boardId: state.board._id })
        if (JSON.stringify(list) !== JSON.stringify(save.list)) commit({ type: 'setList', list });
      } catch (err) {
        console.log('Set list failed...', err);
      }
    },
    async setCard({ commit, state, dispatch }, { card, listId }) {
      try {
        const save = deepCopy({ type: 'removeCard', card, listId });
        card = await boardService.setCard(card, { boardId: state.board._id, listId });
        console.log(state.board._id)
        if (JSON.stringify(card) !== JSON.stringify(save.card)) commit({ type: 'setCard', card, listId });
      } catch (err) {
        console.log('Set card failed...', err);
      }
    },
    async setItem({ commit, state, dispatch }, { item, listId, cardId, key }) {
      try {
        const list = state.board.lists.find(list => list.cards.find(card => card.id === cardId)) || state.board.lists.find(list => list.id === listId);
        // const list = state.board.lists.find(list => list.id === listId);
        const card = list.cards.find(card => card.id === cardId);
        let isAdded;
        if (typeOf(card[key]) === 'Array')
          isAdded = Boolean(item.id) && !Boolean(card[key].find(cardItem => cardItem.id === item.id));
        else isAdded = !Boolean(card[key]);
        const save = deepCopy({ type: isAdded ? 'removeItem' : 'setItem', item: card[key], listId, cardId, key });
        commit({ type: 'setItem', item, listId, cardId, key });
        item = await boardService.setItem({ key, item }, { boardId: state.board._id, listId, cardId })
        if (!item) commit(save);
        return item;
      } catch (err) {
        console.log('Set item failed...', err);
      }
    },
    // REMOVE
    async removeList({ commit, state, dispatch }, { list }) {
      try {
        const save = deepCopy({ type: 'setList', list });
        list = await boardService.removeList(list, { boardId: state.board._id });
        commit({ type: 'removeList', list });
      } catch (err) {
        console.log('Remove list failed...', err);
      }
    },
    async removeCard({ commit, state, dispatch }, { listId, card }) {
      try {
        const save = deepCopy({ type: 'setCard', listId, card });
        card = await boardService.removeCard(card, { boardId: state.board._id, listId })
        commit({ type: 'removeCard', listId, card });
      } catch (err) {
        console.log('Remove card failed...', err);
      }
    },
    async removeItem({ commit, state, dispatch }, { item, listId, cardId, key }) {
      try {
        const list = state.board.lists.find(list => list.cards.find(card => card.id === cardId));
        const card = list.cards.find(card => card.id === cardId);
        const save = deepCopy({ type: 'setItem', listId, cardId, item, key });
        item = await boardService.removeItem({ key, item }, { boardId: state.board._id, listId, cardId });
        commit({ type: 'removeItem', item, listId, cardId, key });
      } catch (err) {
        console.log('Remove item failed', err);
      }
    },
  
    // COPY
    async copyCard({ commit, state }, { listId, card }) {
      try {
        delete card.id
        card = await boardService.setCard(card, { boardId: state.board._id, listId });
        commit({ type: 'setCard', card, listId });
        return card
      } catch (err) {
        console.log('failid to copy card...')
      }
    },
    
    // SORT
    async sortBoard({ commit, state }, { map }) {
      try {
        await boardService.sort(map, state.board._id);
        commit({ type: 'sortBoard', map });
      } catch (err) {
        console.log(err);
      }
    },
    // SOCKET
    async socket({ commit, state }, { socketCmd }) {
      try {
        const { boardId, userId } = socketCmd;
        if (userId !== getLoggedinUser()?._id && boardId === state.board._id) commit(socketCmd);
      } catch (err) {
        console.log('Socket commit failed', err);
      }
    },
  }
}