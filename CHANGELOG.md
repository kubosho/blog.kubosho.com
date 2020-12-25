# [2.5.0](https://github.com/kubosho/kubosho.com/compare/v2.4.0...v2.5.0) (2020-12-25)


### Features

* enlarged a text to 1.125x ([f87691a](https://github.com/kubosho/kubosho.com/commit/f87691abcc7e399d225d6b927aa14ed64d43ddba))

# [2.4.0](https://github.com/kubosho/kubosho.com/compare/v2.3.0...v2.4.0) (2020-12-21)


### Features

* **page/entry:** tweak Twitter embedded style ([f34788f](https://github.com/kubosho/kubosho.com/commit/f34788ff38149dcba2ec5742831e19188f0fa1c1))

# [2.3.0](https://github.com/kubosho/kubosho.com/compare/v2.2.0...v2.3.0) (2020-12-11)


### Bug Fixes

* **code_highlighter:** fix some code not being syntax highlight ([02f2d37](https://github.com/kubosho/kubosho.com/commit/02f2d3724c7b712f39458405bf7d442573de1c45))
* **entryConverter:** Fix not embedding html in articles. ([16ceba7](https://github.com/kubosho/kubosho.com/commit/16ceba7bb84f76343d4491b0e86aa69f061be7f3))
* **pages/*:** fix CJK tag name issue ([7f0c521](https://github.com/kubosho/kubosho.com/commit/7f0c5213c0e4c44292fc7a438aeb24fd5c397ce6))
* package.json & yarn.lock to reduce vulnerabilities ([f1be989](https://github.com/kubosho/kubosho.com/commit/f1be9891e7d0cb7ddef2792c85faa3ebfbdb7634))
* **EntryList:** fix broken layout in aricle list ([650251c](https://github.com/kubosho/kubosho.com/commit/650251c2a51ef2a6969f3fc7dfec0fd02f2562dd))
* **pages:** move dns-prefetch and preconnect settings to head element ([aaef8df](https://github.com/kubosho/kubosho.com/commit/aaef8dffa460d3a4b67990c555bd6966b581ce23))
* **pages/entry:** fix import duplicate ([33748d8](https://github.com/kubosho/kubosho.com/commit/33748d8ba613276087f1e821db3edd43dae4efc2))
* **pages/entry:** fix problem with code sticking out of code block ([82f737d](https://github.com/kubosho/kubosho.com/commit/82f737da2a731e49848388019a895977a40f6c78))


### Features

* change spacer size ([583926a](https://github.com/kubosho/kubosho.com/commit/583926a9cf74ff64a403e0349ab0ee82af3b2f51))
* change variable name in front matter ([eb71f3f](https://github.com/kubosho/kubosho.com/commit/eb71f3f13d5ae55ff663280fe210a854e88309ff))
* use Meiryo for body element ([5ca619a](https://github.com/kubosho/kubosho.com/commit/5ca619a03a650510f37636ed3afa8bf70ab46949))
* **activate_bugsnag:** remove bugsnag activation function ([6c36353](https://github.com/kubosho/kubosho.com/commit/6c36353baaf22193d5947e39b8e4038f5d47513e))
* **common_styles/color:** change background color in code block ([2fa3c1d](https://github.com/kubosho/kubosho.com/commit/2fa3c1da951cab41b96fc18b5f3c1c0bab2310b0))
* **common_styles/foundation:** change background color in inline code ([b7af62d](https://github.com/kubosho/kubosho.com/commit/b7af62deba9a190a23fd40c70e8141274e39696a))
* **constants:** change site description ([ff0518f](https://github.com/kubosho/kubosho.com/commit/ff0518fd21784eeea03fc17d652bb4c66aac8291))
* **constants:** update site description ([0a9f118](https://github.com/kubosho/kubosho.com/commit/0a9f118c25780138f253f3bd219794a10fafe390))
* **entries:** add 'WindowsでもmacOSのようなキー操作を実現する' ([af3625a](https://github.com/kubosho/kubosho.com/commit/af3625a32d80b159056335e6f7e1a37323a11f4d))
* **entries:** add '気分が落ち込んで何もできない休日が続いたので心療内科に通うことにした' ([eaca22a](https://github.com/kubosho/kubosho.com/commit/eaca22a5368f0b82e79e5e12735ea3897e9eeda2))
* **entries:** change language on code block ([23812e2](https://github.com/kubosho/kubosho.com/commit/23812e207e8626ffc0587142ae5b408bcebbf63d))
* **entriesJsonBuilder:** add ignoreDir argument to readEntryList() ([077879d](https://github.com/kubosho/kubosho.com/commit/077879d7979104d58f8206562d34162f19ab14e7))
* **entry:** implement convertISOStringToMilliseconds() function ([4f62ead](https://github.com/kubosho/kubosho.com/commit/4f62eaddeb0e55ee50aab59ed59c4db96e26cef3))
* **entry:** use SNS icon SVG in SnsLink component ([ee0d5a8](https://github.com/kubosho/kubosho.com/commit/ee0d5a885ea94a4b119fbe0ae8fec493d70b88e9))
* **entry/date:** tweak date style ([1f9c99a](https://github.com/kubosho/kubosho.com/commit/1f9c99a090132981347e1e508c0f01fff6bae267))
* **entry/date:** use dayjs instead of luxon ([87bbc21](https://github.com/kubosho/kubosho.com/commit/87bbc21006e484fc7ab7a194ae65ca0f42802d1a))
* **entry/use-autohotkey-to-macos-like-keymapping:** add AutoHotkey code block ([351dd8d](https://github.com/kubosho/kubosho.com/commit/351dd8dd045983b4880c1f134107f88144477383))
* **entryConverter:** apply syntax highlight to entry contents ([221346e](https://github.com/kubosho/kubosho.com/commit/221346ee992cd776c8b83da2fc8a08fd9385c233))
* **entryConverter:** change entryValueParameter mapping to entryValue mapping ([8e3e8d2](https://github.com/kubosho/kubosho.com/commit/8e3e8d25793321947c4869914bfb9008eeb9cb62))
* **entryConverter:** implement convert breaks to br element ([8382b4d](https://github.com/kubosho/kubosho.com/commit/8382b4d3f609b11ba4fb0ecbb90aa6d34116d59c))
* **entryConverter:** implement function to escape html ([c6d4eb4](https://github.com/kubosho/kubosho.com/commit/c6d4eb46a466c83e4c1a95df458a0d2c2df22493))
* **entryConverter:** set breaks option of marked ([77c8c5d](https://github.com/kubosho/kubosho.com/commit/77c8c5dcf1b5bfa6b66ca506b2f6dd18ece8bbd9))
* **entryConverter:** use remark-gfm on markdown processor ([fed5e92](https://github.com/kubosho/kubosho.com/commit/fed5e926b90a9b480fc32b9f0e49eee7391846ef))
* **entryConverter:** use unified instead of marked and sanitize-html ([a065fe0](https://github.com/kubosho/kubosho.com/commit/a065fe0de4e21c1afd0705173dac58adc2b5b297))
* **entryConverter:** use unifiedjs ([9f3e360](https://github.com/kubosho/kubosho.com/commit/9f3e3607897fb9534f2c94044303fa14d0cc66ca))
* **entryDelivery:** add getEntryIdList() ([ccf9b5a](https://github.com/kubosho/kubosho.com/commit/ccf9b5aa52e210a0615c32bfdda51eabc1b4cb29))
* **entryGateway:** Use destructuring assignment ([d390639](https://github.com/kubosho/kubosho.com/commit/d390639d2d03dffaa3ed388d627b8c6e66981792))
* **entryGateway:** use entryConverter as is without using the API ([546f694](https://github.com/kubosho/kubosho.com/commit/546f69401171ce49e28080092e19d5d86a1fb7ab))
* **EntryList:** add line for link text ([2cc7b4d](https://github.com/kubosho/kubosho.com/commit/2cc7b4dba46ad31e089665c2c1299139c79ea6f0))
* **EntryList:** add line-height style for date text ([044cf5e](https://github.com/kubosho/kubosho.com/commit/044cf5e64c96da2d44abe136a36eb57f7514d73b))
* **EntryList:** add square on the title left side ([b5f1d02](https://github.com/kubosho/kubosho.com/commit/b5f1d02b89458220207f834318ec9e14ea1424bf))
* **EntryList:** remove border in EntryList bottom ([3111d5c](https://github.com/kubosho/kubosho.com/commit/3111d5ce627f115d1753763ff9162765794d6f94))
* **EntryList:** remove square on the title left side ([67d16f6](https://github.com/kubosho/kubosho.com/commit/67d16f6da3234acc51b1f20dc607bc98006a26d1))
* **EntryList:** tweak entry list title style ([fad782c](https://github.com/kubosho/kubosho.com/commit/fad782c580da7b867f0cb9af09fe0436d4801735))
* **EntryList:** tweak margin in excerpt text ([6058831](https://github.com/kubosho/kubosho.com/commit/605883176ca8250adffc3bb5fe3805f3d4e5c4d0))
* **EntryList:** tweak margin size ([e41ae1c](https://github.com/kubosho/kubosho.com/commit/e41ae1c1b856e6ce122b10c8917bc59825901b9c))
* **EntryListHeader:** add EntryListHeader component ([c3e2c35](https://github.com/kubosho/kubosho.com/commit/c3e2c35432d06c2c82c009ed67b226a7fa2bb09e))
* **ErrorBoundary:** include Bugsnag activate process ([3460f21](https://github.com/kubosho/kubosho.com/commit/3460f21c56770bbf560aac3cb6830ec7e12aa6e8))
* **icon:** add SNS SVG icons ([6fa56ea](https://github.com/kubosho/kubosho.com/commit/6fa56ea8d9b1a3519743f9586134838145f14136))
* **page/document:** change props initialize function to getStaticProps() ([0c709e8](https://github.com/kubosho/kubosho.com/commit/0c709e85febf66f18efa9753e97bba4df1692e1e))
* **page/entry:** separate entry page style ([4f98840](https://github.com/kubosho/kubosho.com/commit/4f9884099b9f4fca5b3ad1ee8bb6d683d6459481))
* **page/entry:** separate entry title component ([1bbfe5b](https://github.com/kubosho/kubosho.com/commit/1bbfe5b54790094e7ef047d06ee023ff66428914))
* **PageDescription:** add component to display the page description ([cf2a9e6](https://github.com/kubosho/kubosho.com/commit/cf2a9e6f5434f9d19fede976b7a63f0a78bb2bf1))
* **pages:** add dns-prefetch and preconnect settings ([b7d3f5d](https://github.com/kubosho/kubosho.com/commit/b7d3f5d433883f6c93e7988b819a7e045c091fa4))
* **pages:** loading SNS widget script is only entry page ([919e798](https://github.com/kubosho/kubosho.com/commit/919e79822f616a2062f6bf701cd980abe3716a9b))
* **pages:** use EntryListHeader in each pages ([2f18588](https://github.com/kubosho/kubosho.com/commit/2f18588d28310b27aabc90d75d935d2fe7cc96c5))
* **pages/app:** apply prism okaidia theme ([fc3cd8d](https://github.com/kubosho/kubosho.com/commit/fc3cd8d10aa74a4903d1981799269fcaa683210c))
* **pages/categories:** introduce SSG for categories page ([eeb7a0f](https://github.com/kubosho/kubosho.com/commit/eeb7a0f2a87be35b181df46b38ab9e28c21c8956))
* **pages/document:** use getInitialProps static method ([f18b74b](https://github.com/kubosho/kubosho.com/commit/f18b74bc2e31986da5b85761553f784c7dbc74dc))
* **pages/document:** use Html component on custom document ([f2827a5](https://github.com/kubosho/kubosho.com/commit/f2827a573803bd11caf5e763bf50333442ee8052))
* **pages/entry:** adjust margin of nested list element ([3fd7c39](https://github.com/kubosho/kubosho.com/commit/3fd7c39b9e5e46e8613efae8c7f9be2668fbf0e0))
* **pages/entry:** introduce SSG for entry page ([1d643b1](https://github.com/kubosho/kubosho.com/commit/1d643b16f99c12092c15e7a8d52361b9ae767029))
* **pages/entry:** introduce SSG for entry page ([7d5a942](https://github.com/kubosho/kubosho.com/commit/7d5a942b5804bd2ce720b2fd34ebcb4df60dc842))
* **pages/entry:** introduce SSG in entry page ([28c8d65](https://github.com/kubosho/kubosho.com/commit/28c8d657c8cde15e19725515513c6b1e716686ab))
* **pages/entry:** stop SSG on entry page ([a1fc3c8](https://github.com/kubosho/kubosho.com/commit/a1fc3c858bcfb3d33bc6dd79d83b04827124c445))
* **pages/entry:** stop SSG on entry page ([21bf5e4](https://github.com/kubosho/kubosho.com/commit/21bf5e475b1706a34d22a4499105f01615e066f0))
* **pages/index:** add page description in top page ([2b2ccbd](https://github.com/kubosho/kubosho.com/commit/2b2ccbd932cc8e2f82ae3bd1fe83f3d6ad8a892d))
* **pages/index:** implement static site generation in top page ([b05efb3](https://github.com/kubosho/kubosho.com/commit/b05efb3a8b71a607095feda6770f8cc6b042a189))
* **pages/tags:** introduce SSG for tags page ([ecc01c3](https://github.com/kubosho/kubosho.com/commit/ecc01c312bb9c23823b3c42dec7c2df4fc04eadf))
* **src:** implement syntax highlight ([3b5171b](https://github.com/kubosho/kubosho.com/commit/3b5171b114795322a8ea44a0653e3517f8f80302))
* **vercel:** remove routes setting in versel config ([1cecfc2](https://github.com/kubosho/kubosho.com/commit/1cecfc296d9e63e7e3fdbbd3aa5e4a0acd67e30f))
