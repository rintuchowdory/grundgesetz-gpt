/**
 * Static BVerfG (Bundesverfassungsgericht) decisions data.
 * Used for displaying landmark German constitutional court decisions.
 */

export interface StaticDecision {
  id: number;
  caseNumber: string;
  date: string;
  title: string;
  articles: string[];
  summary: string;
  significance: string;
}

export const STATIC_DECISIONS: StaticDecision[] = [
  {
    "id": 1,
    "caseNumber": "BVerfGE 7, 198",
    "date": "1958-01-15",
    "title": "Lüth-Urteil",
    "articles": [
      "Art. 5",
      "Art. 1"
    ],
    "summary": "Erich Lüth rief öffentlich zum Boykott eines Films von Veit Harlan auf, der im Nationalsozialismus Regisseur des antisemitischen Propagandafilms 'Jud Süß' gewesen war. Das Oberlandesgericht Hamburg verurteilte Lüth wegen sittenwidriger Schädigung (§ 826 BGB). Das Bundesverfassungsgericht hob das Urteil auf und entschied, dass der Boykottaufruf vom Grundrecht der freien Meinungsäußerung gedeckt ist.",
    "significance": "Begründete die Lehre von den Grundrechten als objektive Wertordnung und etablierte die mittelbare Drittwirkung der Grundrechte im Zivilrecht."
  },
  {
    "id": 2,
    "caseNumber": "BVerfGE 6, 32",
    "date": "1957-01-16",
    "title": "Elfes-Urteil",
    "articles": [
      "Art. 2"
    ],
    "summary": "Dem Politiker Wilhelm Elfes wurde die Verlängerung seines Reisepasses verweigert, um Auslandsreisen zu verhindern, auf denen er die Außenpolitik der Bundesregierung öffentlich kritisieren wollte. Das Bundesverfassungsgericht stellte fest, dass Art. 2 Abs. 1 GG die allgemeine Handlungsfreiheit in einem umfassenden Sinne schützt. Die Passverweigerung auf Grundlage des Passgesetzes war im konkreten Fall jedoch verfassungsgemäß.",
    "significance": "Etablierte das weite Verständnis der allgemeinen Handlungsfreiheit unter Art. 2 Abs. 1 GG und definierte die Schranken der verfassungsmäßigen Ordnung."
  },
  {
    "id": 3,
    "caseNumber": "BVerfGE 7, 377",
    "date": "1958-06-11",
    "title": "Apotheken-Urteil",
    "articles": [
      "Art. 12"
    ],
    "summary": "Ein Apotheker wandte sich gegen das bayerische Apothekergesetz, das die Zulassung neuer Apotheken von einer staatlichen Bedürfnisprüfung abhängig machte. Das Bundesverfassungsgericht erklärte diese Beschränkung für verfassungswidrig, da rein wirtschaftliche Zweckmäßigkeitserwägungen keinen Eingriff in die Freiheit der Berufswahl rechtfertigen. Das Gericht stellte fest, dass Eingriffe in Art. 12 Abs. 1 GG stets verhältnismäßig sein müssen.",
    "significance": "Begründete die Drei-Stufen-Theorie zur verfassungsrechtlichen Prüfung von Eingriffen in die Berufsfreiheit nach Art. 12 Abs. 1 GG."
  },
  {
    "id": 4,
    "caseNumber": "BVerfGE 20, 162",
    "date": "1966-08-05",
    "title": "Spiegel-Urteil",
    "articles": [
      "Art. 5"
    ],
    "summary": "Nach Veröffentlichung eines kritischen Artikels über die Bundeswehr ließ die Staatsanwaltschaft die Redaktionsräume des Nachrichtenmagazins Der Spiegel durchsuchen und Redakteure wegen mutmaßlichen Landesverrats verhaften. Die Verfassungsbeschwerde scheiterte zwar wegen Stimmengleichheit im Senat an der erforderlichen Mehrheit, das Gericht formulierte jedoch maßgebliche verfassungsrechtliche Grundsätze. Die freie Presse wurde als unentbehrliches Element des freiheitlichen Staates anerkannt.",
    "significance": "Festigte die verfassungsrechtliche Garantie der Pressefreiheit und den Schutz vertraulicher journalistischer Arbeit."
  },
  {
    "id": 5,
    "caseNumber": "BVerfGE 30, 1",
    "date": "1970-12-15",
    "title": "Abhörurteil (G 10-Gesetz)",
    "articles": [
      "Art. 10",
      "Art. 19"
    ],
    "summary": "Gegenstand des Verfahrens war das Gesetz zur Beschränkung des Post-, Postbeförderungs- und Fernmeldegeheimnisses (G 10), welches staatliche Überwachungsmaßnahmen ohne gerichtliche Anordnung ermöglichte. Das Bundesverfassungsgericht erklärte das Gesetz im Wesentlichen für verfassungsgemäß, verlangte jedoch unabhängige Kontrollgremien als Ausgleich für den entfallenden Rechtsweg. Der Ausschluss des ordentlichen Rechtswegs bedarf strikter verfassungsrechtlicher Rechtfertigung.",
    "significance": "Konkretisierte die Schranken des Post- und Fernmeldegeheimnisses sowie die verfassungsrechtlichen Mindestanforderungen an parlamentarische Überwachungskontrollen."
  },
  {
    "id": 6,
    "caseNumber": "BVerfGE 30, 173",
    "date": "1971-02-24",
    "title": "Mephisto-Urteil",
    "articles": [
      "Art. 5",
      "Art. 1",
      "Art. 2"
    ],
    "summary": "Klaus Manns Roman 'Mephisto' zeichnete das Leben eines Künstlers im Dritten Reich nach, das starke Ähnlichkeiten mit der Biografie des verstorbenen Intendanten Gustaf Gründgens aufwies. Dessen Adoptivsohn erwirkte zivilgerichtlich ein Verbot der Nachdrucke, wogegen der Verlag Verfassungsbeschwerde erhob. Das Bundesverfassungsgericht bestätigte das Verbot und entschied, dass die schrankenlos gewährte Kunstfreiheit im Konfliktfall mit dem allgemeinen Persönlichkeitsrecht abgewogen werden muss.",
    "significance": "Klärte das Wechselspiel zwischen Kunstfreiheit und dem Schutz der Menschenwürde sowie des postmortalen Persönlichkeitsrechts."
  },
  {
    "id": 7,
    "caseNumber": "BVerfGE 34, 269",
    "date": "1973-02-14",
    "title": "Soraya-Urteil",
    "articles": [
      "Art. 2",
      "Art. 1",
      "Art. 20"
    ],
    "summary": "Eine Illustrierte hatte ein frei erfundenes Interview mit Prinzessin Soraya, der Ex-Frau des Schahs von Persien, gedruckt. Der Bundesgerichtshof sprach der Klägerin eine Geldentschädigung wegen schwerer Persönlichkeitsrechtsverletzung zu, obwohl das BGB eine Geldentschädigung für immaterielle Schäden nicht vorsah. Das Bundesverfassungsgericht hielt diese richterliche Rechtsfortbildung für verfassungsgemäß.",
    "significance": "Legitimierte verfassungsrechtlich die Schließung von Schutzlücken durch richterliche Rechtsfortbildung zur Durchsetzung von Grundrechten."
  },
  {
    "id": 8,
    "caseNumber": "BVerfGE 35, 202",
    "date": "1973-06-05",
    "title": "Lebach-Urteil",
    "articles": [
      "Art. 2",
      "Art. 1",
      "Art. 5"
    ],
    "summary": "Ein wegen Beihilfe zum Raubüberfall Verurteilter wandte sich gegen die geplante Ausstrahlung eines Fernseh-Dokumentarspiels kurz vor seiner Entlassung aus der Strafhaft. Das Bundesverfassungsgericht gab der Verfassungsbeschwerde statt und untersagte die Ausstrahlung mit Namens- und Bildnennung. Das Resozialisierungsinteresse des Täters wiegt nach Verbüßung der Strafe schwerer als das Berichterstattungsinteresse der Medien.",
    "significance": "Etablierte den verfassungsrechtlichen Schutz des Resozialisierungsinteresses als Bestandteil des allgemeinen Persönlichkeitsrechts."
  },
  {
    "id": 9,
    "caseNumber": "BVerfGE 39, 1",
    "date": "1975-02-25",
    "title": "Schwangerschaftsabbruch I",
    "articles": [
      "Art. 2",
      "Art. 1"
    ],
    "summary": "Der Bundestag hatte eine Fristenlösung verabschiedet, die den Schwangerschaftsabbruch in den ersten zwölf Wochen generell straffrei stellte. Das Bundesverfassungsgericht erklärte das Gesetz für verfassungswidrig, da das ungeborene Leben ab der Nisteinnistung unter dem Schutz von Art. 2 Abs. 2 GG steht. Der Staat ist verpflichtet, dieses Leben grundsätzlich auch gegenüber der Mutter rechtlich zu schützen.",
    "significance": "Begründete die verfassungsrechtliche Schutzpflicht des Staates für das ungeborene Leben und führte zur Einführung des Indikationsmodells."
  },
  {
    "id": 10,
    "caseNumber": "BVerfGE 5, 85",
    "date": "1956-08-17",
    "title": "KPD-Verbot",
    "articles": [
      "Art. 21"
    ],
    "summary": "Auf Antrag der Bundesregierung verbot das Bundesverfassungsgericht die Kommunistische Partei Deutschlands (KPD) wegen Verfassungswidrigkeit. Das Gericht stellte fest, dass die KPD eine aktiv-kämpferische Haltung gegen die freiheitliche demokratische Grundordnung einnahm. Ein Parteiverbot setzt voraus, dass eine Partei die Verfassungsordnung nicht nur ablehnt, sondern diese fortlaufend beeinträchtigen oder beseitigen will.",
    "significance": "Konkretisierte im Rahmen der wehrhaften Demokratie die strengen Tatbestandsvoraussetzungen für ein Parteiverbot nach Art. 21 Abs. 2 GG."
  },
  {
    "id": 11,
    "caseNumber": "BVerfGE 4, 157",
    "date": "1955-05-04",
    "title": "Saarstatut-Urteil",
    "articles": [
      "Art. 79",
      "Art. 19"
    ],
    "summary": "Bundestagsabgeordnete klagten gegen das Zustimmungsgesetz zum Abkommen über das Saarstatut, das die Internationalisierung des Saargebiets vorschlug. Das Bundesverfassungsgericht wies die Klage ab und entschied, dass das Abkommen nicht gegen das verfassungsrechtliche Wiedervereinigungsgebot verstößt. Der Gesetzgeber besitzt bei außenpolitischen Entscheidungen einen weiten Gestaltungs- und Beurteilungsspielraum.",
    "significance": "Bekräftigte das verfassungsrechtliche Gebot der Wiedervereinigung Deutschlands und grenzte die gerichtliche Kontrolldichte in der Außenpolitik ab."
  },
  {
    "id": 12,
    "caseNumber": "BVerfGE 61, 82",
    "date": "1982-06-23",
    "title": "Startbahn West",
    "articles": [
      "Art. 19",
      "Art. 2"
    ],
    "summary": "Kläger wandten sich im Wege des vorläufigen Rechtsschutzes gegen den Sofortvollzug des Planfeststellungsbeschlusses für den Bau der Startbahn 18 West am Flughafen Frankfurt. Das Bundesverfassungsgericht stellte klar, dass der Anspruch auf effektiven Rechtsschutz nach Art. 19 Abs. 4 GG auch im Eilverfahren vollumfänglich gewahrt werden muss. Gerichte dürfen vorläufigen Rechtsschutz nicht durch unzureichende Prüfung irreparable vollendete Tatsachen schaffen lassen.",
    "significance": "Schärfte die verfassungsrechtlichen Anforderungen an die Gewährung effektiven Rechtsschutzes bei Großprojekten und Umweltentscheidungen."
  },
  {
    "id": 13,
    "caseNumber": "BVerfGE 69, 315",
    "date": "1985-05-14",
    "title": "Brokdorf-Beschluss",
    "articles": [
      "Art. 8"
    ],
    "summary": "Die Versammlungsbehörde hatte Demonstrationen im weiten Umkreis des Kernkraftwerks Brokdorf präventiv und pauschal verboten. Das Bundesverfassungsgericht hob die Verbote als unverhältnismäßig auf und betonte den herausragenden Wert der Versammlungsfreiheit für die Demokratie. Staatliche Verbote oder Auflösungen sind nur als ultima ratio bei einer konkreten und unmittelbaren Gefährdung wichtiger Rechtsgüter zulässig.",
    "significance": "Setzte grundlegende Maßstäbe für das Versammlungsrecht, verbot präventive Pauschalverbote und etablierte das Prinzip der Kooperation zwischen Behörden und Veranstaltern."
  },
  {
    "id": 14,
    "caseNumber": "BVerfGE 65, 1",
    "date": "1983-12-15",
    "title": "Volkszählungsurteil",
    "articles": [
      "Art. 2",
      "Art. 1"
    ],
    "summary": "Zahlreiche Verfassungsbeschwerden wandten sich gegen das Volkszählungsgesetz 1983 wegen unbegrenzter staatlicher Datenerhebung und -verknüpfung. Das Bundesverfassungsgericht erklärte Teile des Gesetzes für verfassungswidrig und begründete ein neues Grundrecht. Unter den Bedingungen der modernen Datenverarbeitung muss der Einzelne grundsätzlich selbst bestimmen können, wann und wie seine persönlichen Daten preisgegeben werden.",
    "significance": "Begründete das Grundrecht auf informationelle Selbstbestimmung als zentralen Eckpfeiler des modernen Datenschutzrechts."
  },
  {
    "id": 15,
    "caseNumber": "BVerfGE 83, 37",
    "date": "1990-10-31",
    "title": "Ausländerwahlrecht I",
    "articles": [
      "Art. 20",
      "Art. 28"
    ],
    "summary": "Das Land Schleswig-Holstein hatte ausländischen Einwohnern mit mehrjährigem Wohnsitz das Wahlrecht bei Kommunalwahlen gewährt. Das Bundesverfassungsgericht erklärte das Landesgesetz für verfassungswidrig, da das Volk im Sinne des Art. 20 Abs. 2 GG das deutsche Staatsvolk ist. Eine Ausweitung des Wahlrechts auf Nicht-Staatsangehörige ist ohne Grundgesetzänderung unzulässig.",
    "significance": "Präzisierte das verfassungsrechtliche Demokratieprinzip und stellte klar, dass die Ausübung von Staatsgewalt Legitimation durch das Staatsvolk erfordert."
  },
  {
    "id": 16,
    "caseNumber": "BVerfGE 90, 145",
    "date": "1994-03-09",
    "title": "Cannabis-Beschluss I",
    "articles": [
      "Art. 2",
      "Art. 3"
    ],
    "summary": "Gerichte legten die Frage vor, ob das strafrechtliche Verbot des Erwerbs und Besitzes geringer Mengen Cannabis zum Eigenverbrauch verfassungswidrig sei. Das Bundesverfassungsgericht hielt die Strafnormen im Betäubungsmittelgesetz grundsätzlich für verfassungsgemäß, verpflichtete jedoch die Bundesländer zur verhältnismäßigen Praxis. Bei geringen Mengen zum Gelegenheitsverbrauch müssen Strafverfolgungsbehörden regelmäßig von der Verfolgung absehen.",
    "significance": "Bestätigte den staatlichen Schutzauftrag im Drogenrecht, erzwang jedoch verhältnismäßige Einstellungsrichtlinien bei Bagatellverstößen."
  },
  {
    "id": 17,
    "caseNumber": "BVerfGE 93, 1",
    "date": "1995-05-16",
    "title": "Kruzifix-Beschluss",
    "articles": [
      "Art. 4",
      "Art. 6"
    ],
    "summary": "Eltern wandten sich gegen die bayerische Volksschulordnung, die das Anbringen eines Kreuzes in allen Klassenzimmern vorschrieb. Das Bundesverfassungsgericht erklärte die Bestimmung für verfassungswidrig, da das staatlich verordnete Kruzifix in Pflichtschulen die negative Religionsfreiheit schulpflichtiger Kinder anderer Überzeugungen verletzt. Der Staat hat in der öffentlichen Schule Neutralität zu wahren.",
    "significance": "Stärkte die negative Religionsfreiheit und prägte die Rechtsprechung zur weltanschaulich-religiösen Neutralität des Staates in Pflichtschulen."
  },
  {
    "id": 18,
    "caseNumber": "BVerfGE 93, 266",
    "date": "1995-10-10",
    "title": "Soldaten sind Mörder",
    "articles": [
      "Art. 5",
      "Art. 1"
    ],
    "summary": "Strafgerichte hatten Verfasser von Beiträgen wegen Beleidigung verurteilt, die das Zitat 'Soldaten sind Mörder' öffentlich verwendeten. Das Bundesverfassungsgericht hob die Strafurteile auf, da pauschale Äußerungen, die sich an ein Kollektiv richten, nicht ohne Weiteres als ehrverletzender Angriff auf einzelne Personen gedeutet werden dürfen. Äußerungen müssen im Gesamtzusammenhang ausgewertet werden.",
    "significance": "Setzte hohe verfassungsrechtliche Hürden für die Bestrafung von Meinungsäußerungen wegen Kollektivbeleidigung."
  },
  {
    "id": 19,
    "caseNumber": "BVerfGE 95, 173",
    "date": "1997-01-22",
    "title": "Tabak-Warnhinweise",
    "articles": [
      "Art. 12",
      "Art. 5"
    ],
    "summary": "Tabakhersteller klagten gegen die gesetzliche Verpflichtung, gesundheitliche Warnhinweise auf Zigarettenpackungen aufzudrucken. Das Bundesverfassungsgericht bewertete die Pflicht als verfassungsgemäße Berufsausübungsregelung, die durch überwiegende Gründe des Gesundheitsschutzes gerechtfertigt ist. Die Pflicht zur Aufbringung sachlicher Warnungen verletzt weder die Berufs- noch die Meinungsfreiheit der Hersteller.",
    "significance": "Bestätigte den weiten Gesetzgebungsspielraum bei verbraucherschützenden Berufsausübungsregelungen zur Volksgesundheit."
  },
  {
    "id": 20,
    "caseNumber": "BVerfGE 100, 313",
    "date": "1999-07-14",
    "title": "Telekommunikationsüberwachung I",
    "articles": [
      "Art. 10",
      "Art. 19"
    ],
    "summary": "Die Verfassungsbeschwerde betraf Vorschriften der Strafprozessordnung zur verdachtsunabhängigen und verdeckten Telekommunikationsüberwachung durch Sicherheitsbehörden. Das Bundesverfassungsgericht erklärte Bestimmungen für verfassungswidrig, die keinen absoluten Schutz für den unantastbaren Kernbereich privater Lebensgestaltung garantierten. Zudem fehlte es an hinreichenden Benachrichtigungs- und Kontrollrechten für Betroffene.",
    "significance": "Begründete den unantastbaren Kernbereichsschutz des Intimbereichs gegenüber staatlichen Überwachungsmaßnahmen."
  },
  {
    "id": 21,
    "caseNumber": "BVerfGE 108, 282",
    "date": "2003-09-24",
    "title": "Kopftuch-Urteil I",
    "articles": [
      "Art. 4",
      "Art. 33",
      "Art. 20"
    ],
    "summary": "Einer muslimischen Lehramtsanwärterin wurde die Übernahme in den Schuldienst verweigert, weil sie im Unterricht ein Kopftuch tragen wollte. Das Bundesverfassungsgericht entschied, dass das Verbot des Tragens religiöser Symbole im Schulunterricht einer ausdrücklichen und bestimmten gesetzlichen Grundlage im Landesrecht bedarf. Ein pauschaler Ausschluss durch die Schulverwaltung ohne Gesetz verletzt die Glaubensfreiheit.",
    "significance": "Unterstrich die Geltung des Vorbehalts des Gesetzes bei Eingriffen in die Religionsfreiheit öffentlich Bediensteter."
  },
  {
    "id": 22,
    "caseNumber": "BVerfGE 115, 1",
    "date": "2005-12-06",
    "title": "Transsexuellengesetz III",
    "articles": [
      "Art. 2",
      "Art. 1"
    ],
    "summary": "Gegenstand war die verfassungsrechtliche Prüfung von Alters- und Beziehungsauflagen im Transsexuellengesetz für die rechtliche Anerkennung des empfundenen Geschlechts. Das Bundesverfassungsgericht erklärte die Regelungen für verfassungswidrig, da das allgemeine Persönlichkeitsrecht auch die geschlechtliche Identität schützt. Der Staat darf die rechtliche Anerkennung der Geschlechtszugehörigkeit nicht an unzumutbare Bedingungen knüpfen.",
    "significance": "Stärkte das verfassungsrechtliche Schutzkonzept der geschlechtlichen Selbstbestimmung als Ausfluss des allgemeinen Persönlichkeitsrechts."
  },
  {
    "id": 23,
    "caseNumber": "BVerfGE 120, 274",
    "date": "2008-02-27",
    "title": "Online-Durchsuchung",
    "articles": [
      "Art. 2",
      "Art. 1",
      "Art. 13"
    ],
    "summary": "Das Bundesverfassungsgericht überprüfte Befugnisse des Verfassungsschutzes Nordrhein-Westfalen zur heimlichen Durchsuchung informationstechnischer Systeme über das Internet. Das Gericht erklärte die Normen für nichtig und schuf ein neues Grundrecht. Der verdeckte staatliche Zugriff auf IT-Systeme ist nur bei konkreter Gefahr für überragend wichtige Rechtsgüter wie Leib, Leben oder Staatssicherheit unter richterlicher Anordnung zulässig.",
    "significance": "Etablierte das Grundrecht auf Gewährleistung der Vertraulichkeit und Integrität informationstechnischer Systeme (IT-Grundrecht)."
  },
  {
    "id": 24,
    "caseNumber": "BVerfGE 121, 135",
    "date": "2008-05-07",
    "title": "AWACS-Luftraumüberwachung",
    "articles": [
      "Art. 87a",
      "Art. 24",
      "Art. 38"
    ],
    "summary": "Gegenstand des Organstreits war der Einsatz bewaffneter deutscher Streitkräfte zur NATO-Luftraumüberwachung in der Türkei ohne vorherigen Bundestagsbeschluss. Das Bundesverfassungsgericht stellte fest, dass die Bundesregierung die Rechte des Bundestages verletzt hatte. Jeder Einsatz bewaffneter Streitkräfte im Ausland erfordert grundsätzlich die vorherige konstitutive Zustimmung des Deutschen Bundestages.",
    "significance": "Festigte die Lehre vom 'Parlamentsheer' und entwickelte Maßstäbe für die Reichweite der Beteiligungsrechte des Bundestages bei Bundeswehreinsätzen."
  },
  {
    "id": 25,
    "caseNumber": "BVerfGE 123, 267",
    "date": "2009-06-30",
    "title": "Lissabon-Urteil",
    "articles": [
      "Art. 38",
      "Art. 23",
      "Art. 20",
      "Art. 79"
    ],
    "summary": "Beschwerdeführer wandten sich gegen das Gesetz zum Vertrag von Lissabon zur Fortentwicklung der Europäischen Union. Das Bundesverfassungsgericht erklärte das Zustimmungsgesetz im Wesentlichen für verfassungsgemäß, verlangte aber eine Stärkung der parlamentarischen Mitwirkungsrechte von Bundestag und Bundesrat. Die europäischen Verträge dürfen die verfassungsrechtliche Identität des Grundgesetzes und das Demokratieprinzip nicht entleeren.",
    "significance": "Begründete die verfassungsrechtliche Integrationsverantwortung des Gesetzgebers und definierte die Schranken der Verfassungsidentität nach Art. 79 Abs. 3 GG."
  },
  {
    "id": 26,
    "caseNumber": "BVerfGE 124, 300",
    "date": "2009-11-04",
    "title": "Wunsiedel-Entscheidung",
    "articles": [
      "Art. 5",
      "Art. 8",
      "Art. 3"
    ],
    "summary": "Ein Versammlungsanmelder klagte gegen das Verbot eines Gedenkmarsches für den NS-Verbrecher Rudolf Heß auf Grundlage des § 130 Abs. 4 StGB. Das Bundesverfassungsgericht bestätigte die Verfassungsmäßigkeit des Tatbestands, da die Billigung der nationalsozialistischen Gewalt- und Willkürherrschaft wegen der historischen Erfahrung des Grundgesetzes eine verfassungsimmanente Ausnahme vom Verbot von Sondergesetzen darstellt. Der öffentliche Frieden schützt vor friedensstörenden Kundgebungen.",
    "significance": "Begründete eine historische Ausnahme vom allgemeinen Sonderrechtsverbot des Art. 5 Abs. 2 GG für Bestimmungen gegen NS-Wiederbetätigung."
  },
  {
    "id": 27,
    "caseNumber": "BVerfGE 130, 318",
    "date": "2012-02-28",
    "title": "EFSF Sondergremium",
    "articles": [
      "Art. 38",
      "Art. 20",
      "Art. 110"
    ],
    "summary": "Abgeordnete rügten die Übertragung von Beteiligungsrechten des Bundestages bei Eilentscheidungen über europäische Finanzhilfen auf ein neunköpfiges Sondergremium. Das Bundesverfassungsgericht erklärte das Sondergremium für weitgehend verfassungswidrig, da es die Budgetverantwortung des Gesamtplenums entleere und Abgeordnete unzulässig benachteilige. Dringlichkeit rechtfertigt den Ausschluss des Plenums nur in außergewöhnlichen Sondersituationen.",
    "significance": "Stärkte die verfassungsrechtliche Stellung des einzelnen Abgeordneten und das Budgetrecht des Bundestagsplenums bei Euro-Rettungsmaßnahmen."
  },
  {
    "id": 28,
    "caseNumber": "BVerfGE 137, 273",
    "date": "2014-10-22",
    "title": "Kirchliches Arbeitsrecht",
    "articles": [
      "Art. 140",
      "Art. 4",
      "Art. 12"
    ],
    "summary": "Einem katholischen Chefarzt wurde wegen Wiederverheiratung nach ziviler Scheidung von einem katholischen Krankenhaus gekündigt. Arbeitsgerichte erklärten die Kündigung für unwirksam, woraufhin die Kirche Verfassungsbeschwerde einlegte. Das Bundesverfassungsgericht hob die Urteile auf und stellte fest, dass staatliche Gerichte das kirchliche Selbstbestimmungsrecht achten müssen und glaubensbezogene Loyalitätspflichten nicht durch eigene Maßstäbe ersetzen dürfen.",
    "significance": "Bekräftigte den verfassungsrechtlichen Schutz des kirchlichen Selbstbestimmungsrechts im Arbeitsrecht der Religionsgemeinschaften."
  },
  {
    "id": 29,
    "caseNumber": "BVerfGE 138, 296",
    "date": "2015-01-27",
    "title": "Kopftuch-Urteil II",
    "articles": [
      "Art. 4",
      "Art. 33"
    ],
    "summary": "Muslimische Pädagoginnen fochten Vorschriften im Schulgesetz Nordrhein-Westfalen an, die ein pauschales Verbot religiöser Bekleidung für Lehrkräfte voraussetzten. Das Bundesverfassungsgericht erklärte das pauschale Kopftuchverbot für verfassungswidrig. Ein Verbot greift unzulässig in die Glaubensfreiheit ein, wenn nicht im Einzelfall eine hinreichend konkrete Gefahr für den Schulfrieden oder die staatliche Neutralität vorliegt.",
    "significance": "Hob den Schutzstandard für das Tragen religiöser Symbole durch Lehrkräfte an und verlangte eine konkrete Gefahrenprognose im Einzelfall."
  },
  {
    "id": 30,
    "caseNumber": "BVerfGE 142, 123",
    "date": "2016-06-21",
    "title": "OMT-Programm der EZB",
    "articles": [
      "Art. 38",
      "Art. 20",
      "Art. 23"
    ],
    "summary": "Beschwerdeführer machten geltend, dass der unbegrenzte Aufkauf von Staatsanleihen durch das OMT-Programm der Europäischen Zentralbank das Mandat der Währungspolitik überschreite. Nach einer Vorabentscheidung des Europäischen Gerichtshofs wies das Bundesverfassungsgericht die Anträge im Wesentlichen ab. Das OMT-Programm ist verfassungskonform, solange die vom EuGH formulierten strikten Bedingungen für den Anleihekauf eingehalten werden.",
    "significance": "Präzisierte das Verfahren der Ultra-Vires- und Identitätskontrolle gegenüber Organen der Europäischen Union."
  },
  {
    "id": 31,
    "caseNumber": "BVerfGE 144, 20",
    "date": "2017-01-17",
    "title": "NPD-Verbotsverfahren II",
    "articles": [
      "Art. 21"
    ],
    "summary": "Der Bundesrat beantragte erneut das Verbot der Nationaldemokratischen Partei Deutschlands (NPD). Das Bundesverfassungsgericht stellte zwar fest, dass die NPD verfassungsfeindliche Ziele anstrebt, lehnte das Verbot jedoch mangels Potentialität ab. Es bestanden keine konkreten Anhaltspunkte dafür, dass das Handeln der Partei zur Erreichung ihrer verfassungsfeindlichen Ziele führen könnte.",
    "significance": "Ergänzte das Erfordernis der Potentialität für Parteiverbote nach Art. 21 Abs. 2 GG, was zur Schaffung des Ausschlusses von staatlicher Parteienfinanzierung führte."
  },
  {
    "id": 32,
    "caseNumber": "BVerfGE 153, 182",
    "date": "2020-02-26",
    "title": "Geschäftsmäßige Sterbehilfe",
    "articles": [
      "Art. 2",
      "Art. 1"
    ],
    "summary": "Ärzte und Sterbehilfevereine klagten gegen den § 217 StGB, der die geschäftsmäßige Förderung der Selbsttötung unter Strafe stellte. Das Bundesverfassungsgericht erklärte das Verbot für verfassungswidrig, da das allgemeine Persönlichkeitsrecht das Recht auf selbstbestimmtes Sterben schützt. Dieses Recht umfasst auch die Freiheit, hierfür die freiwillige Hilfe Dritter in Anspruch zu nehmen.",
    "significance": "Begründete ein Grundrecht auf selbstbestimmtes Sterben und setzte der Kriminalisierung von Suizidhilfe engste verfassungsrechtliche Grenzen."
  },
  {
    "id": 33,
    "caseNumber": "BVerfGE 154, 17",
    "date": "2020-05-05",
    "title": "PSPP-Programm der EZB",
    "articles": [
      "Art. 38",
      "Art. 20",
      "Art. 23"
    ],
    "summary": "Das Bundesverfassungsgericht überprüfte Beschlüsse der Europäischen Zentralbank zum Anleihekaufprogramm PSPP. Das Gericht entschied, dass EZB und EuGH mangels nachvollziehbarer Verhältnismäßigkeitsprüfung ultragutachterlich (ultra vires) gehandelt hatten. Deutsche Verfassungsorgane wurden angewiesen, auf eine Verhältnismäßigkeitsprüfung durch die EZB hinzuwirken.",
    "significance": "Erste Feststellung des Bundesverfassungsgerichts, dass eine EU-Maßnahme in Deutschland als Ultra-Vires-Akt unanwendbar ist."
  },
  {
    "id": 34,
    "caseNumber": "BVerfGE 157, 30",
    "date": "2021-03-24",
    "title": "Klimaschutz-Beschluss",
    "articles": [
      "Art. 20a",
      "Art. 2",
      "Art. 14"
    ],
    "summary": "Junge Beschwerdeführer wandten sich gegen Regelungen des Bundes-Klimaschutzgesetzes zur Reduktion von Treibhausgasen bis zum Jahr 2030. Das Bundesverfassungsgericht erklärte das Gesetz für teilweise verfassungswidrig, da es die Hauptlasten der Emissionsminderung unzulässig in spätere Zeiträume verschiebe. Der Gesetzgeber muss Grundrechte durch eine vorausschauende intertemporale Freiheitssicherung schützen.",
    "significance": "Begründete das verfassungsrechtliche Prinzip der intertemporal wirkenden Freiheitssicherung im Umwelt- und Klimaschutzrecht."
  },
  {
    "id": 35,
    "caseNumber": "BVerfGE 160, 1",
    "date": "2021-12-07",
    "title": "Kernbrennstoff-Umschlag Bremen",
    "articles": [
      "Art. 71",
      "Art. 73",
      "Art. 109"
    ],
    "summary": "Das Land Bremen hatte im Hafenbetriebsgesetz ein Umschlagverbot für Kernbrennstoffe in bremischen Häfen erlassen. Das Bundesverfassungsgericht erklärte die Bestimmung wegen Fehlens einer Landesgesetzgebungskompetenz für nichtig. Regelungen über Kernbrennstoffe und Kernenergie fallen in die Gesetzgebungskompetenz des Bundes.",
    "significance": "Klärte das Kompetenzgefüge zwischen Bund und Ländern im Atom- und Hafenrecht."
  }
];
