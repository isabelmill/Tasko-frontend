import { boardService } from '../../services/board-service.js'

export default {
    state: {
        boards: null,
        selectedBoard: null,
        filterBy: {
            txt: '',
        },
    },
    getters: {
        board(state) {
            return state.selectedBoard
        },
        boards(state) {
            return state.boards
        },
        starredBoards(state) {
            return state.boards.filter(board => board.isStarred)
        },
        recentlyBoards(state) {
            const recentlyBoards = JSON.parse(JSON.stringify(state.boards))
            let newBoards = recentlyBoards.filter(board => !board.isTemplate)
            return newBoards.sort((a, b) => b.lastTimeWatched - a.lastTimeWatched);
        },
        templates(state) {
            return state.boards.filter(board => board.isTemplate)
        },
        categoryBusiness(state) {
            return state.boards.filter(board => board.category === 'business' && board.isTemplate)
        },
        categoryDesign(state) {
            return state.boards.filter(board => board.category === 'design' && board.isTemplate)
        },
        categoryEducation(state) {
            return state.boards.filter(board => board.category === 'education' && board.isTemplate)
        },
        allActivities(state) {
            var allActivities = []
            state.boards.forEach(board => board.activities.forEach(activity => allActivities.unshift(activity)))
            return allActivities
        },
        filteredBoards(state) {
            if (!state.filterBy.txt) return state.boards.filter(board => !board.isTemplate)
            if (state.filterBy.txt) {
                const regexTxt = new RegExp(state.filterBy.txt, 'i')
                return state.boards.filter(board =>
                    regexTxt.test(board.title) && !board.isTemplate)
            }
        },
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        setBoard(state, { board }) {
            state.selectedBoard = board;
        },
        removeBoard(state, { id }) {
            const idx = state.boards.findIndex((board) => board._id === id)
            state.boards.splice(idx, 1)
        },
        saveBoard(state, { board }) {
            const idx = state.boards.findIndex((currBoard) => currBoard._id === board._id)
            if (idx !== -1) state.boards.splice(idx, 1, board)
            else state.boards.push(board)
        },
        setFilter(state, { filterBy }) {
            state.filterBy = filterBy
        },
    },
    actions: {
        async loadBoards({ commit, state }) {
            try {
                const boards = await boardService.query(state.filterBy)
                commit({ type: 'setBoards', boards });
            } catch (err) {
                console.log('err');
            }
        },
        async loadBoardById({ commit }, { newId }) {
            try {
                const board = await boardService.getById(newId)
                commit({ type: 'setBoard', board })
            } catch (err) {
                console.log('err!!');
            }
        },
        async removeBoard({ commit }, { id }) {
            try {
                await boardService.remove(id)
                commit({ type: 'removeBoard', id });
            } catch (err) {
                console.log('err!!');
            }
        },
        async saveBoard({ commit }, { board }) {
            try {
                if (board._id) commit({ type: 'setBoard', board });
                const savedBoard = await boardService.save(board)
                commit({ type: 'saveBoard', board: savedBoard });
            } catch (err) {
                console.log('sorry user connot do that!!!');
            }
        },
        // filter({ commit, dispatch }, { filterBy }) {
        //     commit({ type: 'setFilter', filterBy });
        //     dispatch({
        //         type: 'loadBoards'
        //     });
        // },
    },
}