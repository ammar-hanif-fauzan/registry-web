import React from 'react';
import GenericHeader from '../common/GenericHeader';
import RegistryCard from './RegistryCard';
import { CustomPagination } from '../common/CustomPagination';
import { Node } from 'src/api/generated';
import algoliasearch from 'algoliasearch/lite';
import {
    Configure,
    HierarchicalMenu,
    Hits,
    InstantSearch,
    Pagination,
} from 'react-instantsearch';
import Autocomplete from '@/components/Search/Autocomplete';
import Hit from '../Search/SearchHit';

import {
    INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES,
    INSTANT_SEARCH_INDEX_NAME,
} from 'src/constants';

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);

type RegistryProps = {
    totalPages: number;
    currentPage: number;
    setPage: (page: number) => void;
    nodes: Node[];
};

const Registry: React.FC<RegistryProps> = ({
    currentPage,
    totalPages,
    setPage,
    nodes,
}) => {
    const onPageChange = (page: number) => {
        setPage(page);
    };

    return (
        <div className="relative mt-8 bg-gray-900 lg:mt-20">
            <GenericHeader
                title="Welcome to the Registry"
                subTitle="View nodes or sign in to create and publish your own"
                buttonText="Get Started"
                buttonLink="/nodes"
            />
            <div className="md:w-full w-full mt-5">
                <InstantSearch
                    searchClient={searchClient}
                    indexName={INSTANT_SEARCH_INDEX_NAME}
                    routing={{
                        history: {
                            cleanUrlOnDispose: false,
                        },
                    }}
                    future={{
                        preserveSharedStateOnUnmount: true,
                    }}
                >
                    <header className="header">
                        <div className="header-wrapper wrapper">
                            <Autocomplete
                                searchClient={searchClient}
                                placeholder="Search Nodes"
                                detachedMediaQuery="none"
                                openOnFocus
                            />
                        </div>
                    </header>

                    <Configure
                        attributesToSnippet={['name:7', 'description:15']}
                        snippetEllipsisText="…"
                    />
                    <div className="container wrapper">
                        <div>
                            <Hits hitComponent={Hit} />
                        </div>
                    </div>
                    <div className="absolute right-0 mt-3 -bottom-14">
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
                </InstantSearch>
            </div>
            <div className="grid gap-4 pt-20 mb-6 lg:mb-5 md:grid-cols-3 xl:grid-cols-4 items-stretch">
                {nodes?.map((node, index) => (
                    <RegistryCard
                        key={index}
                        {...node}
                        publisherName={node.publisher?.id}
                        isLoggedIn={false}
                    />
                ))}
            </div>
            <div className="absolute right-0 mt-3 -bottom-14">
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default Registry;
