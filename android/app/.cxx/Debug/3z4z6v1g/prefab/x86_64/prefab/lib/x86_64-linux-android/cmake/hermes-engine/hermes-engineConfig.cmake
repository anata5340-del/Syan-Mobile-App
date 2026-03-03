if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/kashif/.gradle/caches/8.14.3/transforms/1549e4bbe5c8536d81b32663a65c6de0/transformed/jetified-hermes-android-0.81.0-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/kashif/.gradle/caches/8.14.3/transforms/1549e4bbe5c8536d81b32663a65c6de0/transformed/jetified-hermes-android-0.81.0-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

