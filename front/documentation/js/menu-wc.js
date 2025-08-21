'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">lecyclelyonnais documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ActionsPageModule.html" data-type="entity-link" >ActionsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ActionsPageModule-ab148b3e9775fc2271d001e7c0f3c3afe45c1ffd4fb1766a81ea08932303c2473d4dc6d098389371262cce3fa04c2d5a5d47983b72691e03895d9b5486715196"' : 'data-bs-target="#xs-components-links-module-ActionsPageModule-ab148b3e9775fc2271d001e7c0f3c3afe45c1ffd4fb1766a81ea08932303c2473d4dc6d098389371262cce3fa04c2d5a5d47983b72691e03895d9b5486715196"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ActionsPageModule-ab148b3e9775fc2271d001e7c0f3c3afe45c1ffd4fb1766a81ea08932303c2473d4dc6d098389371262cce3fa04c2d5a5d47983b72691e03895d9b5486715196"' :
                                            'id="xs-components-links-module-ActionsPageModule-ab148b3e9775fc2271d001e7c0f3c3afe45c1ffd4fb1766a81ea08932303c2473d4dc6d098389371262cce3fa04c2d5a5d47983b72691e03895d9b5486715196"' }>
                                            <li class="link">
                                                <a href="components/ActionsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActionsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ActionsPageRoutingModule.html" data-type="entity-link" >ActionsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AddBikePageRoutingModule.html" data-type="entity-link" >AddBikePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AddressPageModule.html" data-type="entity-link" >AddressPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AddressPageRoutingModule.html" data-type="entity-link" >AddressPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminsListPageModule.html" data-type="entity-link" >AdminsListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminsListPageModule-c118b6eeca2509ea645cb6f9356817cd17d9f25b05f31f0a0aa046cfe22c0656d5d8620a015e69fec612d218d90b8dae81157eb007521c0e73c74f1056b41901"' : 'data-bs-target="#xs-components-links-module-AdminsListPageModule-c118b6eeca2509ea645cb6f9356817cd17d9f25b05f31f0a0aa046cfe22c0656d5d8620a015e69fec612d218d90b8dae81157eb007521c0e73c74f1056b41901"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminsListPageModule-c118b6eeca2509ea645cb6f9356817cd17d9f25b05f31f0a0aa046cfe22c0656d5d8620a015e69fec612d218d90b8dae81157eb007521c0e73c74f1056b41901"' :
                                            'id="xs-components-links-module-AdminsListPageModule-c118b6eeca2509ea645cb6f9356817cd17d9f25b05f31f0a0aa046cfe22c0656d5d8620a015e69fec612d218d90b8dae81157eb007521c0e73c74f1056b41901"' }>
                                            <li class="link">
                                                <a href="components/AdminsListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminsListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminsListPageRoutingModule.html" data-type="entity-link" >AdminsListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminsPageModule.html" data-type="entity-link" >AdminsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminsPageModule-3b55b4e6a759d25772ce562eb0b6d81d96126fcf17d94e34ebc41ae0c314c3c51d57224eb905aae9bcbf5d21132bf428cb3b27b04d1a4af0fe67a5e54c8c1204"' : 'data-bs-target="#xs-components-links-module-AdminsPageModule-3b55b4e6a759d25772ce562eb0b6d81d96126fcf17d94e34ebc41ae0c314c3c51d57224eb905aae9bcbf5d21132bf428cb3b27b04d1a4af0fe67a5e54c8c1204"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminsPageModule-3b55b4e6a759d25772ce562eb0b6d81d96126fcf17d94e34ebc41ae0c314c3c51d57224eb905aae9bcbf5d21132bf428cb3b27b04d1a4af0fe67a5e54c8c1204"' :
                                            'id="xs-components-links-module-AdminsPageModule-3b55b4e6a759d25772ce562eb0b6d81d96126fcf17d94e34ebc41ae0c314c3c51d57224eb905aae9bcbf5d21132bf428cb3b27b04d1a4af0fe67a5e54c8c1204"' }>
                                            <li class="link">
                                                <a href="components/AdminsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminsPageRoutingModule.html" data-type="entity-link" >AdminsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-3167fbc48a99899fff158315f53ba59d17568833b050e3d371762e950a0ff6e06b4199667c64358e28aa301cf668f88aceae57487ab2df61cf2acd1086569ad3"' : 'data-bs-target="#xs-components-links-module-AppModule-3167fbc48a99899fff158315f53ba59d17568833b050e3d371762e950a0ff6e06b4199667c64358e28aa301cf668f88aceae57487ab2df61cf2acd1086569ad3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-3167fbc48a99899fff158315f53ba59d17568833b050e3d371762e950a0ff6e06b4199667c64358e28aa301cf668f88aceae57487ab2df61cf2acd1086569ad3"' :
                                            'id="xs-components-links-module-AppModule-3167fbc48a99899fff158315f53ba59d17568833b050e3d371762e950a0ff6e06b4199667c64358e28aa301cf668f88aceae57487ab2df61cf2acd1086569ad3"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoaderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BikePageModule.html" data-type="entity-link" >BikePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-BikePageModule-ec41c935d889d57b08ae588a379e6e0ca3a008db3ff732377975907df7271a0645b637437b28b4a02c3d6ffc728e61acf74776048abc1dce0a0ed105aa05f44d"' : 'data-bs-target="#xs-components-links-module-BikePageModule-ec41c935d889d57b08ae588a379e6e0ca3a008db3ff732377975907df7271a0645b637437b28b4a02c3d6ffc728e61acf74776048abc1dce0a0ed105aa05f44d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BikePageModule-ec41c935d889d57b08ae588a379e6e0ca3a008db3ff732377975907df7271a0645b637437b28b4a02c3d6ffc728e61acf74776048abc1dce0a0ed105aa05f44d"' :
                                            'id="xs-components-links-module-BikePageModule-ec41c935d889d57b08ae588a379e6e0ca3a008db3ff732377975907df7271a0645b637437b28b4a02c3d6ffc728e61acf74776048abc1dce0a0ed105aa05f44d"' }>
                                            <li class="link">
                                                <a href="components/BikePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BikePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BikesListPageModule.html" data-type="entity-link" >BikesListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-BikesListPageModule-13cc954d84582ac0c7be12ba6bb1efb6f524fcc007c8e2e3940a90e1f6f538760cd6ddc3b13d9206e0ee446f0d02b7a12c6693c6c9d4d165f7c97c4b4e2cebf0"' : 'data-bs-target="#xs-components-links-module-BikesListPageModule-13cc954d84582ac0c7be12ba6bb1efb6f524fcc007c8e2e3940a90e1f6f538760cd6ddc3b13d9206e0ee446f0d02b7a12c6693c6c9d4d165f7c97c4b4e2cebf0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BikesListPageModule-13cc954d84582ac0c7be12ba6bb1efb6f524fcc007c8e2e3940a90e1f6f538760cd6ddc3b13d9206e0ee446f0d02b7a12c6693c6c9d4d165f7c97c4b4e2cebf0"' :
                                            'id="xs-components-links-module-BikesListPageModule-13cc954d84582ac0c7be12ba6bb1efb6f524fcc007c8e2e3940a90e1f6f538760cd6ddc3b13d9206e0ee446f0d02b7a12c6693c6c9d4d165f7c97c4b4e2cebf0"' }>
                                            <li class="link">
                                                <a href="components/BikesListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BikesListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BikesListPageRoutingModule.html" data-type="entity-link" >BikesListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CompanyListPageModule.html" data-type="entity-link" >CompanyListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CompanyListPageModule-9e1cb73f25b299dd18592a6334473e687854be3f543fb19394e030794519fd193a291d6b6094629857c486ca586f51c98b87c9cf244ea9f8ad938b2fe3a61710"' : 'data-bs-target="#xs-components-links-module-CompanyListPageModule-9e1cb73f25b299dd18592a6334473e687854be3f543fb19394e030794519fd193a291d6b6094629857c486ca586f51c98b87c9cf244ea9f8ad938b2fe3a61710"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CompanyListPageModule-9e1cb73f25b299dd18592a6334473e687854be3f543fb19394e030794519fd193a291d6b6094629857c486ca586f51c98b87c9cf244ea9f8ad938b2fe3a61710"' :
                                            'id="xs-components-links-module-CompanyListPageModule-9e1cb73f25b299dd18592a6334473e687854be3f543fb19394e030794519fd193a291d6b6094629857c486ca586f51c98b87c9cf244ea9f8ad938b2fe3a61710"' }>
                                            <li class="link">
                                                <a href="components/CompanyListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CompanyListPageRoutingModule.html" data-type="entity-link" >CompanyListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CompanyPageModule.html" data-type="entity-link" >CompanyPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CompanyPageModule-63de53190d1158249d8030280d2670b63ae6b022708c865b25b4728605abebd3ffe58ebd35e96f632e40a1ca3327e7e727bbd86aeeae4aaccfca97f5277a0733"' : 'data-bs-target="#xs-components-links-module-CompanyPageModule-63de53190d1158249d8030280d2670b63ae6b022708c865b25b4728605abebd3ffe58ebd35e96f632e40a1ca3327e7e727bbd86aeeae4aaccfca97f5277a0733"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CompanyPageModule-63de53190d1158249d8030280d2670b63ae6b022708c865b25b4728605abebd3ffe58ebd35e96f632e40a1ca3327e7e727bbd86aeeae4aaccfca97f5277a0733"' :
                                            'id="xs-components-links-module-CompanyPageModule-63de53190d1158249d8030280d2670b63ae6b022708c865b25b4728605abebd3ffe58ebd35e96f632e40a1ca3327e7e727bbd86aeeae4aaccfca97f5277a0733"' }>
                                            <li class="link">
                                                <a href="components/CompanyPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CompanyPageRoutingModule.html" data-type="entity-link" >CompanyPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InterventionsPageModule.html" data-type="entity-link" >InterventionsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-InterventionsPageModule-6509daf2109b18c9094684377e2ba760e3e5c9d36c5d2317ebe184c8450eb741a96d740d0ae38c46ac7e9e9695e1b8a29a23eec529717e564fe2c95343cf55e8"' : 'data-bs-target="#xs-components-links-module-InterventionsPageModule-6509daf2109b18c9094684377e2ba760e3e5c9d36c5d2317ebe184c8450eb741a96d740d0ae38c46ac7e9e9695e1b8a29a23eec529717e564fe2c95343cf55e8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InterventionsPageModule-6509daf2109b18c9094684377e2ba760e3e5c9d36c5d2317ebe184c8450eb741a96d740d0ae38c46ac7e9e9695e1b8a29a23eec529717e564fe2c95343cf55e8"' :
                                            'id="xs-components-links-module-InterventionsPageModule-6509daf2109b18c9094684377e2ba760e3e5c9d36c5d2317ebe184c8450eb741a96d740d0ae38c46ac7e9e9695e1b8a29a23eec529717e564fe2c95343cf55e8"' }>
                                            <li class="link">
                                                <a href="components/InterventionsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InterventionsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InterventionsPageRoutingModule.html" data-type="entity-link" >InterventionsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LeafletListPageModule.html" data-type="entity-link" >LeafletListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LeafletListPageModule-4435c7c0f0902ec30f4bc38f9b7d1545eecbbc34487d5ae34bac3029258be1cc57c572007fc4b40627e4582d761328da8703a01096bdfdb30d8ba4a44dad0ac0"' : 'data-bs-target="#xs-components-links-module-LeafletListPageModule-4435c7c0f0902ec30f4bc38f9b7d1545eecbbc34487d5ae34bac3029258be1cc57c572007fc4b40627e4582d761328da8703a01096bdfdb30d8ba4a44dad0ac0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LeafletListPageModule-4435c7c0f0902ec30f4bc38f9b7d1545eecbbc34487d5ae34bac3029258be1cc57c572007fc4b40627e4582d761328da8703a01096bdfdb30d8ba4a44dad0ac0"' :
                                            'id="xs-components-links-module-LeafletListPageModule-4435c7c0f0902ec30f4bc38f9b7d1545eecbbc34487d5ae34bac3029258be1cc57c572007fc4b40627e4582d761328da8703a01096bdfdb30d8ba4a44dad0ac0"' }>
                                            <li class="link">
                                                <a href="components/LeafletListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LeafletListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LeafletListPageRoutingModule.html" data-type="entity-link" >LeafletListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LeafletPageModule.html" data-type="entity-link" >LeafletPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LeafletPageModule-ba77e9b475d4ab8198baf2e659b6051e002c5f650cad0beb1febfdd7ebe6066f0bf519c8644612df494b0e84f9ce47242249b91ff419b033e41d647da58ecd85"' : 'data-bs-target="#xs-components-links-module-LeafletPageModule-ba77e9b475d4ab8198baf2e659b6051e002c5f650cad0beb1febfdd7ebe6066f0bf519c8644612df494b0e84f9ce47242249b91ff419b033e41d647da58ecd85"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LeafletPageModule-ba77e9b475d4ab8198baf2e659b6051e002c5f650cad0beb1febfdd7ebe6066f0bf519c8644612df494b0e84f9ce47242249b91ff419b033e41d647da58ecd85"' :
                                            'id="xs-components-links-module-LeafletPageModule-ba77e9b475d4ab8198baf2e659b6051e002c5f650cad0beb1febfdd7ebe6066f0bf519c8644612df494b0e84f9ce47242249b91ff419b033e41d647da58ecd85"' }>
                                            <li class="link">
                                                <a href="components/LeafletPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LeafletPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TechnicianModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TechnicianModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ZoneModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZoneModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LeafletPageRoutingModule.html" data-type="entity-link" >LeafletPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginAdminPageModule.html" data-type="entity-link" >LoginAdminPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoginAdminPageModule-7a0bd05731886e1aac761ac2c1bdce7e43a77dcf53313ba769bae24df331b39c1af5ebf0c264186c1c2f5df1e473e16fb5e2dabd4ee54e051c5ede3e990835d1"' : 'data-bs-target="#xs-components-links-module-LoginAdminPageModule-7a0bd05731886e1aac761ac2c1bdce7e43a77dcf53313ba769bae24df331b39c1af5ebf0c264186c1c2f5df1e473e16fb5e2dabd4ee54e051c5ede3e990835d1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginAdminPageModule-7a0bd05731886e1aac761ac2c1bdce7e43a77dcf53313ba769bae24df331b39c1af5ebf0c264186c1c2f5df1e473e16fb5e2dabd4ee54e051c5ede3e990835d1"' :
                                            'id="xs-components-links-module-LoginAdminPageModule-7a0bd05731886e1aac761ac2c1bdce7e43a77dcf53313ba769bae24df331b39c1af5ebf0c264186c1c2f5df1e473e16fb5e2dabd4ee54e051c5ede3e990835d1"' }>
                                            <li class="link">
                                                <a href="components/LoginAdminPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginAdminPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginAdminPageRoutingModule.html" data-type="entity-link" >LoginAdminPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link" >LoginPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link" >LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MesinterventionsPageModule.html" data-type="entity-link" >MesinterventionsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MesinterventionsPageModule-a4528a12564d9e6867c252a7bfa6daa70412b1f218a322e5cf044a8b422cd22ca5678b46410abf568a0af35c67023a91c6e0d76fd3627305250728ce2f7e0700"' : 'data-bs-target="#xs-components-links-module-MesinterventionsPageModule-a4528a12564d9e6867c252a7bfa6daa70412b1f218a322e5cf044a8b422cd22ca5678b46410abf568a0af35c67023a91c6e0d76fd3627305250728ce2f7e0700"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MesinterventionsPageModule-a4528a12564d9e6867c252a7bfa6daa70412b1f218a322e5cf044a8b422cd22ca5678b46410abf568a0af35c67023a91c6e0d76fd3627305250728ce2f7e0700"' :
                                            'id="xs-components-links-module-MesinterventionsPageModule-a4528a12564d9e6867c252a7bfa6daa70412b1f218a322e5cf044a8b422cd22ca5678b46410abf568a0af35c67023a91c6e0d76fd3627305250728ce2f7e0700"' }>
                                            <li class="link">
                                                <a href="components/ImageModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImageModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MesinterventionsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MesinterventionsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MesinterventionsPageRoutingModule.html" data-type="entity-link" >MesinterventionsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PlanningModelsListPageModule.html" data-type="entity-link" >PlanningModelsListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-PlanningModelsListPageModule-65f5287ff7c874b2441bd721b69b04e92e3058bb6273d34a234bef892b5e452749b79504508b0b988f73ad63c80e5058c739fac272a3c7af2b7bfd19039b36a2"' : 'data-bs-target="#xs-components-links-module-PlanningModelsListPageModule-65f5287ff7c874b2441bd721b69b04e92e3058bb6273d34a234bef892b5e452749b79504508b0b988f73ad63c80e5058c739fac272a3c7af2b7bfd19039b36a2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PlanningModelsListPageModule-65f5287ff7c874b2441bd721b69b04e92e3058bb6273d34a234bef892b5e452749b79504508b0b988f73ad63c80e5058c739fac272a3c7af2b7bfd19039b36a2"' :
                                            'id="xs-components-links-module-PlanningModelsListPageModule-65f5287ff7c874b2441bd721b69b04e92e3058bb6273d34a234bef892b5e452749b79504508b0b988f73ad63c80e5058c739fac272a3c7af2b7bfd19039b36a2"' }>
                                            <li class="link">
                                                <a href="components/PlanningModelsListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlanningModelsListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PlanningModelsListPageRoutingModule.html" data-type="entity-link" >PlanningModelsListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PlanningModelsPageModule.html" data-type="entity-link" >PlanningModelsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-PlanningModelsPageModule-0c15ec9d393d7f5ddb03141ffb93cb2ce12f186660dc352eec8bd9e1fece876d98e69e971536aa66a8691d907a6bad16953b526190c3150af71b4f1baa0f3e74"' : 'data-bs-target="#xs-components-links-module-PlanningModelsPageModule-0c15ec9d393d7f5ddb03141ffb93cb2ce12f186660dc352eec8bd9e1fece876d98e69e971536aa66a8691d907a6bad16953b526190c3150af71b4f1baa0f3e74"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PlanningModelsPageModule-0c15ec9d393d7f5ddb03141ffb93cb2ce12f186660dc352eec8bd9e1fece876d98e69e971536aa66a8691d907a6bad16953b526190c3150af71b4f1baa0f3e74"' :
                                            'id="xs-components-links-module-PlanningModelsPageModule-0c15ec9d393d7f5ddb03141ffb93cb2ce12f186660dc352eec8bd9e1fece876d98e69e971536aa66a8691d907a6bad16953b526190c3150af71b4f1baa0f3e74"' }>
                                            <li class="link">
                                                <a href="components/PlanningModelsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlanningModelsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PlanningModelsPageRoutingModule.html" data-type="entity-link" >PlanningModelsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ResetPageModule.html" data-type="entity-link" >ResetPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ResetPageModule-028a0fcda9a88d549a100b99bb256fbc7be4e1eb47da3717c35150f359a82920bc56d5c2feeef634ac76a4dbdd21121ec1501c923148bf43cd12c7aa330b8889"' : 'data-bs-target="#xs-components-links-module-ResetPageModule-028a0fcda9a88d549a100b99bb256fbc7be4e1eb47da3717c35150f359a82920bc56d5c2feeef634ac76a4dbdd21121ec1501c923148bf43cd12c7aa330b8889"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ResetPageModule-028a0fcda9a88d549a100b99bb256fbc7be4e1eb47da3717c35150f359a82920bc56d5c2feeef634ac76a4dbdd21121ec1501c923148bf43cd12c7aa330b8889"' :
                                            'id="xs-components-links-module-ResetPageModule-028a0fcda9a88d549a100b99bb256fbc7be4e1eb47da3717c35150f359a82920bc56d5c2feeef634ac76a4dbdd21121ec1501c923148bf43cd12c7aa330b8889"' }>
                                            <li class="link">
                                                <a href="components/ResetPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResetPageRoutingModule.html" data-type="entity-link" >ResetPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ResetPasswordPageModule.html" data-type="entity-link" >ResetPasswordPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ResetPasswordPageModule-4f490a046c490b32fbb0576315c04fc94ae4c7c0c2ce3af63d16ddb504f388cc881aafae331e162b1733cf8c57470714089c7d54a0a32dadf957a1584c1a6b8e"' : 'data-bs-target="#xs-components-links-module-ResetPasswordPageModule-4f490a046c490b32fbb0576315c04fc94ae4c7c0c2ce3af63d16ddb504f388cc881aafae331e162b1733cf8c57470714089c7d54a0a32dadf957a1584c1a6b8e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ResetPasswordPageModule-4f490a046c490b32fbb0576315c04fc94ae4c7c0c2ce3af63d16ddb504f388cc881aafae331e162b1733cf8c57470714089c7d54a0a32dadf957a1584c1a6b8e"' :
                                            'id="xs-components-links-module-ResetPasswordPageModule-4f490a046c490b32fbb0576315c04fc94ae4c7c0c2ce3af63d16ddb504f388cc881aafae331e162b1733cf8c57470714089c7d54a0a32dadf957a1584c1a6b8e"' }>
                                            <li class="link">
                                                <a href="components/ResetPasswordPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPasswordPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResetPasswordPageRoutingModule.html" data-type="entity-link" >ResetPasswordPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TechnicianListPageModule.html" data-type="entity-link" >TechnicianListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TechnicianListPageModule-e434cfa47139b320c5c4de4ca32a80f53eb93952ebc3661b022032690ebb83e58f4f3e0ffc5e3652414bdaf7224f2406aad1eb82831eb1bcd219d443e12f8b2e"' : 'data-bs-target="#xs-components-links-module-TechnicianListPageModule-e434cfa47139b320c5c4de4ca32a80f53eb93952ebc3661b022032690ebb83e58f4f3e0ffc5e3652414bdaf7224f2406aad1eb82831eb1bcd219d443e12f8b2e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TechnicianListPageModule-e434cfa47139b320c5c4de4ca32a80f53eb93952ebc3661b022032690ebb83e58f4f3e0ffc5e3652414bdaf7224f2406aad1eb82831eb1bcd219d443e12f8b2e"' :
                                            'id="xs-components-links-module-TechnicianListPageModule-e434cfa47139b320c5c4de4ca32a80f53eb93952ebc3661b022032690ebb83e58f4f3e0ffc5e3652414bdaf7224f2406aad1eb82831eb1bcd219d443e12f8b2e"' }>
                                            <li class="link">
                                                <a href="components/TechnicianListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TechnicianListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TechnicianListPageRoutingModule.html" data-type="entity-link" >TechnicianListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TechnicianPageModule.html" data-type="entity-link" >TechnicianPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TechnicianPageModule-3b83c406b75da8c32e7f633e3b30fba2be64b2d94038db7d4a3ab2442d231d0204ae6c03cce12a542d248aa3c74392671bee408a91eb84b92a84a869d5e3448d"' : 'data-bs-target="#xs-components-links-module-TechnicianPageModule-3b83c406b75da8c32e7f633e3b30fba2be64b2d94038db7d4a3ab2442d231d0204ae6c03cce12a542d248aa3c74392671bee408a91eb84b92a84a869d5e3448d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TechnicianPageModule-3b83c406b75da8c32e7f633e3b30fba2be64b2d94038db7d4a3ab2442d231d0204ae6c03cce12a542d248aa3c74392671bee408a91eb84b92a84a869d5e3448d"' :
                                            'id="xs-components-links-module-TechnicianPageModule-3b83c406b75da8c32e7f633e3b30fba2be64b2d94038db7d4a3ab2442d231d0204ae6c03cce12a542d248aa3c74392671bee408a91eb84b92a84a869d5e3448d"' }>
                                            <li class="link">
                                                <a href="components/TechnicianPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TechnicianPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TechnicianPageRoutingModule.html" data-type="entity-link" >TechnicianPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersListPageModule.html" data-type="entity-link" >UsersListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UsersListPageModule-22612cffe14c0294f1506d40a212cce632837926f013ff72c0088e8314afd3dca993e3ac4c566633d42d939d87ed566f27b6d555d572cb4ad48f5a3f7dd0da04"' : 'data-bs-target="#xs-components-links-module-UsersListPageModule-22612cffe14c0294f1506d40a212cce632837926f013ff72c0088e8314afd3dca993e3ac4c566633d42d939d87ed566f27b6d555d572cb4ad48f5a3f7dd0da04"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersListPageModule-22612cffe14c0294f1506d40a212cce632837926f013ff72c0088e8314afd3dca993e3ac4c566633d42d939d87ed566f27b6d555d572cb4ad48f5a3f7dd0da04"' :
                                            'id="xs-components-links-module-UsersListPageModule-22612cffe14c0294f1506d40a212cce632837926f013ff72c0088e8314afd3dca993e3ac4c566633d42d939d87ed566f27b6d555d572cb4ad48f5a3f7dd0da04"' }>
                                            <li class="link">
                                                <a href="components/UsersListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersListPageRoutingModule.html" data-type="entity-link" >UsersListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersPageModule.html" data-type="entity-link" >UsersPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UsersPageModule-fc58cabd759ab08147a339d3ac0d7bc3a9414d409f177946801769a22e354af36af70e8cb9572b52d940ba47f72d5fbce62d20d3e148439ddb9e5d2f27d2a591"' : 'data-bs-target="#xs-components-links-module-UsersPageModule-fc58cabd759ab08147a339d3ac0d7bc3a9414d409f177946801769a22e354af36af70e8cb9572b52d940ba47f72d5fbce62d20d3e148439ddb9e5d2f27d2a591"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersPageModule-fc58cabd759ab08147a339d3ac0d7bc3a9414d409f177946801769a22e354af36af70e8cb9572b52d940ba47f72d5fbce62d20d3e148439ddb9e5d2f27d2a591"' :
                                            'id="xs-components-links-module-UsersPageModule-fc58cabd759ab08147a339d3ac0d7bc3a9414d409f177946801769a22e354af36af70e8cb9572b52d940ba47f72d5fbce62d20d3e148439ddb9e5d2f27d2a591"' }>
                                            <li class="link">
                                                <a href="components/UsersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersPageRoutingModule.html" data-type="entity-link" >UsersPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AddressAutocompleteComponent.html" data-type="entity-link" >AddressAutocompleteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddressPage.html" data-type="entity-link" >AddressPage</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginPage.html" data-type="entity-link" >LoginPage</a>
                            </li>
                            <li class="link">
                                <a href="components/MessageComponent.html" data-type="entity-link" >MessageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OverviewComponent.html" data-type="entity-link" >OverviewComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/FormLoginModel.html" data-type="entity-link" >FormLoginModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormRegisterModel.html" data-type="entity-link" >FormRegisterModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageStatus.html" data-type="entity-link" >MessageStatus</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthBaseService.html" data-type="entity-link" >AuthBaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BaseService.html" data-type="entity-link" >BaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BicycleService.html" data-type="entity-link" >BicycleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientService.html" data-type="entity-link" >ClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CompanyService.html" data-type="entity-link" >CompanyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalService.html" data-type="entity-link" >GlobalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InterventionService.html" data-type="entity-link" >InterventionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OauthService.html" data-type="entity-link" >OauthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlanningModelService.html" data-type="entity-link" >PlanningModelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StandardAuth.html" data-type="entity-link" >StandardAuth</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TechnicianService.html" data-type="entity-link" >TechnicianService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ZoneService.html" data-type="entity-link" >ZoneService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddressSuggestion.html" data-type="entity-link" >AddressSuggestion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BearerToken.html" data-type="entity-link" >BearerToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInfo.html" data-type="entity-link" >UserInfo</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});