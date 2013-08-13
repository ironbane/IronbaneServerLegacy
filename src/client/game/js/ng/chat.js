// chat.js

IronbaneApp.directive('chatWindow', ['$log', function($log) {
    return {
        restrict: 'E',
        template: [
            '<div class="content">',
                '<ul class="messages">',
                    '<li ng-repeat="msg in messages | limitTo:-50">',
                        '<chat-message type="{{ msg.type }}" data="msg"></chat-message>',
                    '</li>',
                '</ul>',
            '</div>'
        ].join(''),
        link: function(scope, el, attrs) {
            scope.messages = [];

            var scroller = el.jScrollPane({
                animateScroll: true,
                contentWidth:400
            }).data('jsp');

            // hook into external (non-angular) sources
            el.bind('onMessage', function(e, data) {
                //$log.log('chat onMessage', e, data);

                scope.$apply(function() {
                    scope.messages.push(data);
                });

                scroller.reinitialise();
                scroller.scrollToBottom();
            });
        }
    };
}])
.directive('chatMessage', ['$log', '$compile', 'DEATH_MESSAGES', function($log, $compile, DEATH_MESSAGES) {
    // logic for all of the different types of messages that are supported
    var templates = {
        welcome: '<div style="color:green;"><span>Hey there, {{ data.user.name }}</span><br>Players online: <span ng-repeat="user in data.online" class="name {{user.rank}}" ng-class="{delim: !$last}">{{ user.name }}</span></div>',
        join: '<div><span class="name {{ data.user.rank }}">{{ data.user.name }}</span> has joined the game!</div>',
        died: '<div><span class="name {{ data.victim.rank }}">{{ data.victim.name }}</span> was {{ deathMessage }} by <span class="name {{ data.killer.rank }}">{{ data.killer.name }}.</span>',
        diedspecial: '<div><span class="name {{ data.victim.rank }}">{{ data.victim.name }}</span> was {{ deathMessage }} by {{ data.cause }}.',
        leave: '<div><span class="name {{ data.user.rank }}">{{ data.user.name }}</span> has left the game.</div>',
        say: '<div><span class="name {{ data.user.rank }}"><{{ data.user.name }}></span> <span ng-bind-html="data.message | mouthwash"></span></div>',
        "announce": '<div class="message" ng-style="{color: data.message.color}" ng-bind-html="data.message.text | mouthwash"></div>',
        "announce:personal": '<div class="message" ng-style="{color: data.message.color}" ng-bind-html="data.message.text | mouthwash"></div>',
        "announce:mods": '<div class="message" ng-style="{color: data.message.color}" ng-bind-html="data.message.text | mouthwash"></div>',
        "default": '<div class="message">{{ data.message | mouthwash }}</div>'
    };

    function getTemplate(type) {
        //$log.log('getTemplate', type);
        if(!(type in templates)) {
            type = "default";
        }

        return templates[type];
    }

    return {
        restrict: 'E',
        scope: {
            type: '@',
            data: '='
        },
        template: '<div></div>',
        link: function(scope, el, attrs) {
            var getDeathMsg = function() {
                var random = Math.floor(Math.random() * DEATH_MESSAGES.length);

                return DEATH_MESSAGES[random];
            };

            // if we are a died type message, choose our message
            if(scope.data.type && scope.data.type.search('died') >= 0) {
                scope.deathMessage = getDeathMsg();
            }

            if(scope.data.type && scope.data.type === 'welcome') {
                if(scope.data.online.length === 0) {
                    scope.data.online.push({name: 'None', rank: 'fool'});
                }
            }

            el.html(getTemplate(scope.type));

            $compile(el.contents())(scope);
        }
    };
}])
.filter('mouthwash', [function() {
    var badWords = [
        {"anus":"butt"},
        {"arse":"butt"},
        {"arsehole":"butt"},
        {"ass":"butt"},
        {"ass-hat":"idiot"},
        {"ass-jabber":"homosexual"},
        {"ass-pirate":"homosexual"},
        {"assbag":"idiot"},
        {"assbandit":"homosexual"},
        {"assbanger":"homosexual"},
        {"assbite":"idiot"},
        {"assclown":"butt"},
        {"asscock":"idiot"},
        {"asscracker":"butt"},
        {"asses":"butts"},
        {"assface":"butt"},
        {"assfuck":"rear-loving"},
        {"assfucker":"homosexual"},
        {"assgoblin":"homosexual"},
        {"asshat":"butt"},
        {"asshead":"idiot"},
        {"asshole":"jerk"},
        {"asshopper":"homosexual"},
        {"assjacker":"homosexual"},
        {"asslick":"idiot"},
        {"asslicker":"Buttlicker"},
        {"assmonkey":"idiot"},
        {"assmunch":"idiot"},
        {"assmuncher":"butt"},
        {"assnigger":"Racial Slur"},
        {"asspirate":"homosexual"},
        {"assshit":"idiot"},
        {"assshole":"butt"},
        {"asssucker":"idiot"},
        {"asswad":"butt"},
        {"asswipe":"butt"},
        {"axwound":"female genitalia"},
        {"bampot":"idiot"},
        {"bastard":"illegitimate child"},
        {"beaner":"Mexican"},
        {"bitch":"female dog"},
        {"bitchass":"idiot"},
        {"bitches":"female dogs"},
        {"bitchtits":"homosexual"},
        {"bitchy":"mean"},
        {"blow job":"sexual act"},
        {"blowjob":"sexual act"},
        {"bollocks":"male genitalia"},
        {"bollox":"male genitalia"},
        {"boner":"erection"},
        {"brotherfucker":"homosexual"},
        {"bullshit":"poop"},
        {"bumblefuck":"homosexual"},
        {"butt plug":"cork"},
        {"butt-pirate":"homosexual"},
        {"buttfucka":"homosexual"},
        {"buttfucker":"homosexual"},
        {"camel toe":"female genitalia"},
        {"carpetmuncher":"homosexual"},
        {"chesticle":"Breast"},
        {"chinc":"Chinese"},
        {"chink":"asian"},
        {"choad":"male genitalia"},
        {"chode":"small penis"},
        {"clit":"female genitals"},
        {"clitface":"idiot"},
        {"clitfuck":"sexual act"},
        {"clusterfuck":"mess up"},
        {"cock":"penis"},
        {"cockass":"Jerk"},
        {"cockbite":"idiot"},
        {"cockburger":"idiot"},
        {"cockface":"idiot"},
        {"cockfucker":"idiot"},
        {"cockhead":"idiot"},
        {"cockjockey":"homosexual"},
        {"cockknoker":"homosexual"},
        {"cockmaster":"homosexual"},
        {"cockmongler":"homosexual"},
        {"cockmongruel":"homosexual"},
        {"cockmonkey":"idiot"},
        {"cockmuncher":"homosexual"},
        {"cocknose":"idiot"},
        {"cocknugget":"idiot"},
        {"cockshit":"idiot"},
        {"cocksmith":"homosexual"},
        {"cocksmoke":"homosexual"},
        {"cocksmoker":"homosexual"},
        {"cocksniffer":"homosexual"},
        {"cocksucker":"homosexual"},
        {"cockwaffle":"idiot"},
        {"coochie":"female genitalia"},
        {"coochy":"female genitalia"},
        {"coon":"African American"},
        {"cooter":"vagina"},
        {"cracker":"Caucasian"},
        {"cum":"semen"},
        {"cumbubble":"idiot"},
        {"cumdumpster":"prostitute"},
        {"cumguzzler":"homosexual"},
        {"cumjockey":"homosexual"},
        {"cumslut":"dirty girl"},
        {"cumtart":"idiot"},
        {"cunnie":"female genitalia"},
        {"cunnilingus":"sexual act"},
        {"cunt":"vagina"},
        {"cuntass":"idiot"},
        {"cuntface":"idiot"},
        {"cunthole":"female genitalia"},
        {"cuntlicker":"homosexual"},
        {"cuntrag":"idiot"},
        {"cuntslut":"idiot"},
        {"dago":"Italian"},
        {"damn":"darn"},
        {"deggo":"Italian"},
        {"dick":"penis"},
        {"dick-sneeze":"orgasm"},
        {"dickbag":"idiot"},
        {"dickbeaters":"Hands"},
        {"dickface":"idiot"},
        {"dickfuck":"idiot"},
        {"dickfucker":"homosexual"},
        {"dickhead":"phallace face"},
        {"dickhole":"male genitalia"},
        {"dickjuice":"semen"},
        {"dickmilk":"sperm"},
        {"dickmonger":"homosexual"},
        {"dicks":"penises"},
        {"dickslap":"sexual act"},
        {"dicksucker":"homosexual"},
        {"dicksucking":"sexual act"},
        {"dicktickler":"homosexual"},
        {"dickwad":"idiot"},
        {"dickweasel":"idiot"},
        {"dickweed":"idiot"},
        {"dickwod":"idiot"},
        {"dike":"homosexual"},
        {"dildo":"sexual toy"},
        {"dipshit":"idiot"},
        {"doochbag":"idiot"},
        {"dookie":"poop"},
        {"douche":"female hygene product"},
        {"douche-fag":"idiot"},
        {"douchebag":"female hygene accessory"},
        {"douchewaffle":"homosexual"},
        {"dumass":"idiot"},
        {"dumb ass":"idiot"},
        {"dumbass":"idiot"},
        {"dumbfuck":"idiot"},
        {"dumbshit":"idiot"},
        {"dumshit":"idiot"},
        {"dyke":"homosexual"},
        {"fag":"homosexual"},
        {"fagbag":"homosexual"},
        {"fagfucker":"homosexual"},
        {"faggit":"homosexual"},
        {"faggot":"homosexual"},
        {"faggotcock":"homosexual"},
        {"fagtard":"homosexual idiot"},
        {"fatass":"a fat person"},
        {"fellatio":"sexual act"},
        {"feltch":"sexual act"},
        {"flamer":"homosexual"},
        {"fuck":"fornicate"},
        {"fuckass":"idiot"},
        {"fuckbag":"idiot"},
        {"fuckboy":"idiot"},
        {"fuckbrain":"idiot"},
        {"fuckbutt":"butt"},
        {"fuckbutter":"Sexual fluids"},
        {"fucked":"had intercourse"},
        {"fucker":"fornicator"},
        {"fuckersucker":"idiot"},
        {"fuckface":"idiot"},
        {"fuckhead":"butt"},
        {"fuckhole":"jerk"},
        {"fuckin":"sexual act"},
        {"fucking":"freaking"},
        {"fucknut":"idiot"},
        {"fucknutt":"idiot"},
        {"fuckoff":"go away"},
        {"fucks":"sexual act"},
        {"fuckstick":"male genitalia"},
        {"fucktard":"Moron"},
        {"fucktart":"idiot"},
        {"fuckup":"idiot"},
        {"fuckwad":"idiot"},
        {"fuckwit":"dummy"},
        {"fuckwitt":"idiot"},
        {"fudgepacker":"homosexual"},
        {"gay":"homosexual"},
        {"gayass":"butt"},
        {"gaybob":"homosexual"},
        {"gaydo":"homosexual"},
        {"gayfuck":"homosexual"},
        {"gayfuckist":"homosexual"},
        {"gaylord":"homosexual"},
        {"gaytard":"homosexual"},
        {"gaywad":"homosexual"},
        {"goddamn":"goshdarn"},
        {"goddamnit":"goshdarnit"},
        {"gooch":"female genitalia"},
        {"gook":"Chinese"},
        {"gringo":"foreigner"},
        {"guido":"italian"},
        {"handjob":"sexual act"},
        {"hard on":"erection"},
        {"heeb":"Jewish Person"},
        {"ho":"woman"},
        {"hoe":"Woman"},
        {"homo":"homosexual"},
        {"homodumbshit":"idiot"},
        {"honkey":"white person"},
        {"humping":"sexual act"},
        {"jackass":"idiot"},
        {"jagoff":"idiot"},
        {"jerk off":"masturbate"},
        {"jerkass":"idiot"},
        {"jigaboo":"African American"},
        {"jizz":"Semen"},
        {"jungle bunny":"african american"},
        {"junglebunny":"african american"},
        {"kike":"Jewish Person"},
        {"kooch":"female genitalia"},
        {"kootch":"female genitalia"},
        {"kraut":"german"},
        {"kunt":"female genitalia"},
        {"kyke":"Jewish person"},
        {"lameass":"loser"},
        {"lardass":"overweight individual"},
        {"lesbian":"homosexual"},
        {"lesbo":"homosexual"},
        {"lezzie":"homosexual"},
        {"mcfagget":"homosexual"},
        {"minge":"female genitalia"},
        {"mothafucka":"Jerk"},
        {"mothafuckin\'":"mother loving"},
        {"motherfucker":"mother lover"},
        {"motherfucking":"fornicating with mother"},
        {"muff":"female genitalia"},
        {"muffdiver":"homosexual"},
        {"munging":"sexual act"},
        {"nigro":"african american"},
        {"negro":"african american"},
        {"nigaboo":"African American"},
        {"nigga":"african american"},
        {"nigger":"african american"},
        {"niggers":"African Americans"},
        {"niglet":"african american child"},
        {"nut sack":"male genitalia"},
        {"nutsack":"male genitalia"},
        {"paki":"pakistanien"},
        {"panooch":"femail genitalia"},
        {"pecker":"Penis"},
        {"peckerhead":"idiot"},
        {"penis":"male genitalia"},
        {"penisbanger":"homosexual"},
        {"penisfucker":"homosexual"},
        {"penispuffer":"homosexual"},
        {"piss":"urinate"},
        {"pissed":"urinated"},
        {"pissed off":"angry"},
        {"pissflaps":"female genitalia"},
        {"polesmoker":"homosexual"},
        {"pollock":"polish person"},
        {"poon":"female genitals"},
        {"poonani":"female genitalia"},
        {"poonany":"vagina"},
        {"poontang":"female genitalia"},
        {"porch monkey":"african american"},
        {"porchmonkey":"African American"},
        {"prick":"penis"},
        {"punanny":"female genitalia"},
        {"punta":"female dog"},
        {"pussies":"Female Genitalias"},
        {"pussy":"female reproductive organ"},
        {"pussylicking":"sexual act"},
        {"puto":"idiot"},
        {"queef":"vaginal fart."},
        {"queer":"homosexual"},
        {"queerbait":"homosexual"},
        {"queerhole":"homosexual"},
        {"renob":"erection"},
        {"rimjob":"dirty sexual act"},
        {"ruski":"Russian"},
        {"sand nigger":"middle eastern"},
        {"sandnigger":"middle eastern"},
        {"schlong":"male genitalia"},
        {"scrote":"male genitalia"},
        {"shit":"poop"},
        {"shitass":"idiot"},
        {"shitbag":"idiot"},
        {"shitbagger":"idiot"},
        {"shitbrains":"idiot"},
        {"shitbreath":"Bad Breath"},
        {"shitcanned":"Fired"},
        {"shitcunt":"idiot"},
        {"shitdick":"idiot"},
        {"shitface":"pooface"},
        {"shitfaced":"Drunk"},
        {"shithead":"jerk"},
        {"shithole":"idiot"},
        {"shithouse":"bathroom"},
        {"shitspitter":"butt"},
        {"shitstain":"poop"},
        {"shitter":"defecator"},
        {"shittiest":"worst"},
        {"shitting":"pooping"},
        {"shitty":"bad"},
        {"shiz":"poop"},
        {"shiznit":"poop"},
        {"skank":"dirty girl"},
        {"skeet":"semen"},
        {"skullfuck":"sexual act"},
        {"slut":"sexually popular woman"},
        {"slutbag":"sexually popular woman"},
        {"smeg":"poop"},
        {"snatch":"female genitalia"},
        {"spic":"mexican"},
        {"spick":"mexican american"},
        {"splooge":"ejaculate"},
        {"spook":"White person"},
        {"suckass":"idiot"},
        {"tard":"mentally challenged"},
        {"testicle":"male genitalia"},
        {"thundercunt":"idiot"},
        {"tit":"breast"},
        {"titfuck":"sexual act"},
        {"tits":"breasts"},
        {"tittyfuck":"sexual act"},
        {"twat":"female genitals"},
        {"twatlips":"idiot"},
        {"twats":"vaginas"},
        {"vagina":"female genitalia"},
        {"wank":"sexual act"},
        {"wankjob":"sexual act"},
        {"wetback":"Mexican"},
        {"whore":"hussy"},
        {"whorebag":"idiot"},
        {"whoreface":"idiot"},
    ];

    return function(input) {
        if(!input) {
            return;
        }

        var clean = " "+input+" ";

        angular.forEach(badWords, function(word) {
            angular.forEach(word, function(value, key) {
                clean = clean.replace(" "+key+" ", " "+value+" ");
            });
        });

        return clean;
    };
}])
.constant('DEATH_MESSAGES', "slaughtered butchered crushed defeated destroyed exterminated finished massacred mutilated slayed vanquished killed".split(" "));
