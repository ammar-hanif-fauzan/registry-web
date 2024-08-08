    import '@algolia/autocomplete-theme-classic'
    import {
        INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
        INSTANT_SEARCH_INDEX_NAME,
        INSTANT_SEARCH_QUERY_SUGGESTIONS,
    } from 'src/constants'

    import type { SearchClient } from 'algoliasearch/lite';
    import type { BaseItem } from '@algolia/autocomplete-core';
    import type { AutocompleteOptions } from '@algolia/autocomplete-js';

    import {
    createElement,
    Fragment,
    useEffect,
    useMemo,
    useRef,
    useState,
    } from 'react';
    import { createRoot, Root } from 'react-dom/client';

    import {
    useHierarchicalMenu,
    usePagination,
    useSearchBox,
    } from 'react-instantsearch';
    import { autocomplete } from '@algolia/autocomplete-js';
    import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
    import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
    import { debounce } from '@algolia/autocomplete-shared';

    import '@algolia/autocomplete-theme-classic';

    type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
        searchClient: SearchClient;
        className?: string;
    };

    type SetInstantSearchUiStateOptions = {
        query: string;
    };

    export function Autocomplete({
        searchClient,
        className,
        ...autocompleteProps
    }: AutocompleteProps) {
        const autocompleteContainer = useRef<HTMLDivElement>(null);
        const panelRootRef = useRef<Root | null>(null);
        const rootRef = useRef<HTMLElement | null>(null);
    
        const { query, refine: setQuery } = useSearchBox();
        const { refine: setPage } = usePagination();
    
        const [instantSearchUiState, setInstantSearchUiState] =
        useState<SetInstantSearchUiStateOptions>({ query });
        const debouncedSetInstantSearchUiState = debounce(
        setInstantSearchUiState,
        500
        );
    
        useEffect(() => {
            console.log('InstantSearchUiState:', instantSearchUiState);
            setQuery(instantSearchUiState.query);
            console.log('Query:', instantSearchUiState.query);
            // setPage(0); // Reset pagination ke halaman pertama
        }, [instantSearchUiState]);
    
        const plugins = useMemo(() => {
            const recentSearches = createLocalStorageRecentSearchesPlugin({
                key: 'instantsearch',
                limit: 3,
                transformSource({ source }) {
                    return {
                        ...source,
                        onSelect({ item }) {

                            console.log('Recent Search Selected:', item);
                            setInstantSearchUiState({
                            query: item.name,
                            });
                        },
                    };
                },
            });
    
            const querySuggestions = createQuerySuggestionsPlugin({
                searchClient,
                indexName: INSTANT_SEARCH_QUERY_SUGGESTIONS,
                getSearchParams() {
                    return recentSearches.data!.getAlgoliaSearchParams({
                    hitsPerPage: 6,
                    });
                },
                transformSource({ source }) {
                    return {
                        ...source,
                        sourceId: 'querySuggestionsPlugin',
                        onSelect({ item }) {
                            console.log('Klik:', item);
                            setInstantSearchUiState({
                                query: item.name,
                            });
                            console.log(autocompleteContainer.current)
                            setInstantSearchUiState({
                                query: item.name,
                            });
                            // if (autocompleteContainer.current) {
                            //     if (autocompleteContainer.current.querySelector('.aa-Input')) {
                            //         console.log('Input:', autocompleteContainer.current.querySelector('.aa-Input'));
                            //         autocompleteContainer.current.querySelector('.aa-Input')!.value = item.name;
                            //     }
                            // }
                            const inputElement = document.querySelector('.aa-Input');
                            console.log('Input:', inputElement);
                            if (inputElement) {
                                console.log('Input:', inputElement);
                                inputElement.value = item.name;
                            }
                            console.log('Query:', autocompleteContainer.current?.querySelector('.aa-Input')?.value);
                            console.log('Query:', autocompleteContainer.current?.innerHTML);
                            // set the value of the input
                            // document.querySelector('.aa-Input')?.value = item.name;
                            // console.log('Value:', document.querySelector('.aa-Input')?.value);
                            searchClient.search([{
                                indexName: INSTANT_SEARCH_INDEX_NAME,
                                query: item.name,
                                params: {
                                hitsPerPage: 10,
                                },
                            }]).then(({ results }) => {
                                recentSearches.data!.addItem({ id:item.name, label: item.name });

                            }).catch(err => {
                                console.error('Pencarian gagal:', err);
                            });
                            // Memperbarui query dan mereset pagination setelah pemilihan item
                            // debouncedSetInstantSearchUiState({
                            //     query: item.name,
                            // });
                        },
                        getItems(params) {
                            if (!params.state.collections) {
                                console.log('Query kosong, tidak ada item yang akan dikembalikan.');
                                return [];
                            }
                            console.log('Items ditemukan:', source.getItems(params));
                            return source.getItems(params);
                        },
                        templates: {
                            item({ item, components }) {
                                return (
                                    <div className="aa-ItemWrapper">
                                        <div className="aa-ItemContent">
                                            <div className="aa-ItemTitle">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                        },
                    };
                },
            });
    
        return [recentSearches, querySuggestions];
        }, []);
    
        useEffect(() => {
        if (!autocompleteContainer.current) {
            return;
        }

        console.log('Query:', query);
        console.log('Plugins:', plugins);
        console.log('AutocompleteProps:', autocompleteProps);
        console.log('SearchClient:', searchClient);
        console.log('INSTANT_SEARCH_INDEX_NAME:', INSTANT_SEARCH_INDEX_NAME);
        

            // Corrected code
        const autocompleteInstance = autocomplete({
            ...autocompleteProps,
            container: autocompleteContainer.current,
            initialState: { query },
            insights: true,
            plugins,
            onReset() {
            },
            onSubmit({ state }) {
                console.log('Query submit:', state.query);
                setInstantSearchUiState({ query: state.query });

                searchClient.search([{
                    indexName: INSTANT_SEARCH_INDEX_NAME,
                    query: state.query,
                    params: {
                    hitsPerPage: 10,
                    },
                }]).then(({ results }) => {
                    console.log(results); // Atau update state/UI dengan hasil pencarian ini
                }).catch(err => {
                    console.error('Pencarian gagal:', err);
                });
            },
            onStateChange({ prevState, state }) {
            if (prevState.query !== state.query) {
                debouncedSetInstantSearchUiState({
                query: state.query,
                });
            }
            },
            renderer: { createElement, Fragment, render: () => {} },
            render({ children }, root) {
            if (!panelRootRef.current || rootRef.current !== root) {
                rootRef.current = root;
                panelRootRef.current?.unmount();
                panelRootRef.current = createRoot(root);
            }
    
            panelRootRef.current.render(children);
            },
        });
    
        return () => autocompleteInstance.destroy();
        }, [plugins]);
    
        return <div className={className}>
            <div ref={autocompleteContainer} />
        </div>;
    }

    export default Autocomplete;