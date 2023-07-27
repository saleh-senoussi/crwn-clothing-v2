import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { categoriesSaga, fetchCategoriesAsync, onFetchCategories } from '../category.saga';
import { call } from 'typed-redux-saga/macro';
import { CATEGORIES_ACTION_TYPES } from '../category.types';
import { getCategoriesAndDocuments } from '../../../utils/firebase/firebase.utils';
import { fetchCategoriesFailed, fetchCategoriesSuccess } from '../category.action';
import { throwError } from 'redux-saga-test-plan/providers';

describe('Category sagas', () => {
    test('categoriesSaga', () => {
        testSaga(categoriesSaga)
            .next()
            .all([call(onFetchCategories)])
            .next()
            .isDone();
    });

    test('onFetchCategories', () => {
        testSaga(onFetchCategories)
            .next()
            .takeLatest(
                CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START,
                fetchCategoriesAsync
            )
            .next()
            .isDone();
    });

    test('onFetchCategoriesAsync success', () => {
        const mockCategoriesArray = [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' }
        ];

        return expectSaga(fetchCategoriesAsync)
            .provide([
                [call(getCategoriesAndDocuments), mockCategoriesArray]
            ])
            .put(fetchCategoriesSuccess(mockCategoriesArray))
            .run();
    });

    test('onFetchCategoriesAsync failure', () => {
        const mockError = new Error('Fetch categories failed')
        return expectSaga(fetchCategoriesAsync)
            .provide([
                [call(getCategoriesAndDocuments), throwError(mockError)]
            ])
            .put(fetchCategoriesFailed(mockError))
            .run();
    });
});