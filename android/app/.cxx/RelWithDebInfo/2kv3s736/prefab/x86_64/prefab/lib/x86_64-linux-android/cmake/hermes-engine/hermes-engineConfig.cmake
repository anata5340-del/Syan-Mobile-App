if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/kashif/.gradle/caches/8.14.3/transforms/5140b06fca7b22505b23fcffaa7a166d/transformed/jetified-hermes-android-0.81.0-release/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/kashif/.gradle/caches/8.14.3/transforms/5140b06fca7b22505b23fcffaa7a166d/transformed/jetified-hermes-android-0.81.0-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

