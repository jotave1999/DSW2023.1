import { makeId } from '../service/util.service';
import { userService } from './user.service';

export const cardService = {
    createList,
    createCard,
    addCheckList,
    addCheckListItem,
    addLocation,
    setImg,
    setCover,
    getMentions,
    getCardById,
}

function getCardById(board, listId, cardId) {
    const list = board.lists.find(item => item.id === listId);
    const card = list.cards.find(el => el.id === cardId);
    return card
};

function createList() {
    return {
        title: '',
        cards: [],
        style: {}
    }
}

function createCard() {
    return {
        createdAt: Date.now(),
        createdBy: userService.getLoggedinUser(),
        title: '',
        desc: '',
        members: [],
        labelsIds: [],
        checkList: [],
        dueDate: {
            date: null,
            isComplete: null,
            createdAt: null,
            completedAt: null,
        },
        location: null,
        canvas: [],
        cover: {
            color: '',
            size: '',
            imgs: [],
            imgId: '',
        },
        archiveAt: 0,
    }
}

function getMentions(board, listId, cardId) {
    if (cardId)
        return board.lists
            .find((list) =>
                list.cards.find((card) => card.id === cardId)
            )?.cards.find((card) => card.id === cardId)?.members || [];
    else if (listId) {
        const mentions = board.lists.find(list => list.id === listId)?.cards.map(card => card.members).reduce((acc, val) => acc.concat(val), []) || [];
        return mentions.filter((fmention, idx) => mentions.findIndex(mention => mention._id === fmention._id) === idx);
    } else board.members || [];
}

function setCover(color = null, size = 'contain', imgId = null) {
    return {
        color,
        size,
        imgs: [],
        imgId
    }
}

function setImg(url = null) {
    return {
        id: makeId(),
        url,
    }
}

function addCheckList(title) {
    return {
        title,
        items: []
    }
}

function addCheckListItem(title, members = []) {
    return {
        title,
        isDone: false,
        dueDate: {
            completedAt: null,
            createAt: null,
            date: null,
        },
        members
    }
}


function addLocation(address) {
    return {
        address,
        lat: '',
        lng: '',
        title: '',
        api: '',
    }
}
