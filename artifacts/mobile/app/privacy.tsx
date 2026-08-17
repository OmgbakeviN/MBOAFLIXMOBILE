import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.badge}>MBOA FLIX</Text>

        <Text style={styles.title}>
          Politique de confidentialité
        </Text>

        <Text style={styles.updated}>
          Dernière mise à jour : 17 août 2026
        </Text>

        <Section title="1. Introduction">
          MBOA FLIX respecte la vie privée de ses utilisateurs.
          Cette politique explique quelles informations peuvent être
          traitées lorsque vous utilisez l'application, comment elles
          sont utilisées et quels services tiers peuvent intervenir.
        </Section>

        <Section title="2. Informations de profil">
          Dans la version actuelle de MBOA FLIX, certaines informations
          comme le nom et l'adresse e-mail peuvent être saisies afin de
          personnaliser l'expérience utilisateur. Ces informations sont
          actuellement conservées localement sur l'appareil et ne sont
          pas utilisées à des fins publicitaires.
        </Section>

        <Section title="3. Préférences de l'application">
          Certaines préférences peuvent être conservées localement sur
          votre appareil, notamment la langue, les contenus enregistrés
          dans My List, les préférences de lecture et certains paramètres
          de l'application.
        </Section>

        <Section title="4. Nkap — Assistant IA">
          Lorsque vous envoyez une question à Nkap, le contenu de votre
          message est transmis au serveur MBOA FLIX afin de générer une
          réponse à l'aide de services d'intelligence artificielle.
          {'\n\n'}
          Le traitement suit actuellement le parcours suivant :
          {'\n\n'}
          Application MBOA FLIX → Serveur MBOA FLIX → OpenRouter →
          fournisseur du modèle d'intelligence artificielle.
          {'\n\n'}
          MBOA FLIX ne stocke actuellement pas les conversations Nkap
          dans sa propre base de données.
          {'\n\n'}
          Les utilisateurs ne doivent pas envoyer à Nkap des informations
          hautement sensibles telles que des mots de passe, informations
          bancaires, documents d'identité ou informations médicales
          confidentielles.
        </Section>

        <Section title="5. Vidéos YouTube">
          MBOA FLIX peut afficher des vidéos hébergées sur YouTube.
          Lorsque vous utilisez le lecteur YouTube intégré, Google et
          YouTube peuvent traiter certaines informations techniques ou
          d'utilisation conformément à leurs propres politiques de
          confidentialité.
          {'\n\n'}
          MBOA FLIX n'héberge pas directement ces vidéos.
        </Section>

        <Section title="6. Données techniques">
          Certaines informations techniques nécessaires au fonctionnement
          d'un service Internet peuvent être traitées temporairement,
          comme l'adresse IP, la date et l'heure d'une requête ou des
          informations liées aux erreurs techniques.
          {'\n\n'}
          Ces informations peuvent être utilisées pour assurer le bon
          fonctionnement, la sécurité et la prévention des abus.
        </Section>

        <Section title="7. Publicité">
          La version actuelle de MBOA FLIX ne contient pas de système
          publicitaire destiné à afficher des annonces personnalisées.
        </Section>

        <Section title="8. Vente des données">
          MBOA FLIX ne vend pas les informations personnelles de ses
          utilisateurs à des annonceurs ou à des courtiers en données.
        </Section>

        <Section title="9. Services tiers">
          MBOA FLIX utilise actuellement certains services tiers,
          notamment OpenRouter pour les fonctionnalités d'intelligence
          artificielle, Google/YouTube pour certains contenus vidéo et
          PythonAnywhere pour l'hébergement du backend Nkap.
        </Section>

        <Section title="10. Conservation des données">
          Les préférences enregistrées localement peuvent rester présentes
          jusqu'à leur suppression par l'utilisateur, l'application ou la
          désinstallation de MBOA FLIX.
          {'\n\n'}
          Les conversations Nkap ne sont actuellement pas enregistrées
          dans la base de données MBOA FLIX.
        </Section>

        <Section title="11. Sécurité">
          MBOA FLIX met en œuvre des mesures raisonnables pour protéger
          les informations traitées. Les clés privées permettant de
          communiquer avec les services d'intelligence artificielle sont
          conservées côté serveur et ne sont pas intégrées directement
          dans l'application mobile.
        </Section>

        <Section title="12. Enfants">
          MBOA FLIX est une plateforme consacrée au cinéma, à la culture
          et au patrimoine camerounais. Elle n'est pas conçue
          spécifiquement comme un service destiné aux jeunes enfants.
        </Section>

        <Section title="13. Intelligence artificielle">
          Les réponses générées par Nkap peuvent contenir des erreurs,
          approximations ou informations incomplètes. Les utilisateurs
          doivent vérifier les informations importantes auprès de sources
          fiables.
        </Section>

        <Section title="14. Contact">
          Pour toute question relative à la confidentialité ou aux données
          personnelles :
          {'\n\n'}
          MBOA FLIX
          {'\n'}
          E-mail : kevinomgba1@gmail.com
        </Section>

        <Section title="15. Modifications">
          Cette politique peut être mise à jour pour refléter les nouvelles
          fonctionnalités, les évolutions de MBOA FLIX ou les changements
          réglementaires.
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>MBOA FLIX</Text>
          <Text style={styles.footerText}>
            Our stories. Our culture. Our screen.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
  },

  content: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 80,
  },

  badge: {
    color: '#E8B94E',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 16,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 10,
  },

  updated: {
    color: '#777777',
    fontSize: 14,
    marginBottom: 42,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    color: '#E8B94E',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  body: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 27,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#252525',
    paddingTop: 30,
    marginTop: 30,
  },

  footerTitle: {
    color: '#E8B94E',
    fontWeight: '800',
    fontSize: 18,
  },

  footerText: {
    color: '#777777',
    marginTop: 5,
  },
});