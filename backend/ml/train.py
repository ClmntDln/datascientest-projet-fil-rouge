import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

def main():
    print("--- Début de l'entraînement du modèle Weeb Classify ---")
    
    # Path settings
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "dataset.csv")
    model_path = os.path.join(base_dir, "model.joblib")
    
    # 1. Chargement des données
    if not os.path.exists(csv_path):
        print(f"Erreur : Le fichier de données {csv_path} n'existe pas. Veuillez d'abord exécuter generate_data.py.")
        return
        
    df = pd.read_csv(csv_path)
    print(f"Jeu de données chargé avec succès : {len(df)} lignes.")
    print("Distribution des classes :")
    print(df['category'].value_counts())
    
    # 2. Préparation des données (combinaison du titre et du résumé)
    df['text'] = df['title'] + " " + df['excerpt'] + " " + df['content']
    X = df['text']
    y = df['category']
    
    # 3. Division train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    print(f"Données d'entraînement : {len(X_train)} exemples.")
    print(f"Données de test : {len(X_test)} exemples.")
    
    # 4. Définition et entraînement du pipeline
    # TF-IDF pour vectoriser le texte + Régression Logistique pour classifier
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            lowercase=True, 
            stop_words='english', # Les textes sont en anglais
            max_df=0.95,
            min_df=2,
            ngram_range=(1, 2)
        )),
        ('clf', LogisticRegression(C=1.0, max_iter=1000, random_state=42))
    ])
    
    print("Entraînement en cours...")
    pipeline.fit(X_train, y_train)
    print("Modèle entraîné avec succès !")
    
    # 5. Évaluation du modèle
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print("\n================ RÉSULTATS D'ÉVALUATION ================")
    print(f"Exactitude (Accuracy) globale : {accuracy:.4f} ({accuracy * 100:.2f}%)")
    
    print("\nRapport de classification détaillée :")
    print(classification_report(y_test, y_pred))
    
    print("Matrice de confusion :")
    labels = sorted(list(y.unique()))
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    
    # Affichage textuel propre de la matrice de confusion
    print(f"{'':<12}", end="")
    for label in labels:
        print(f"{label[:8]:>10}", end="")
    print()
    for i, label in enumerate(labels):
        print(f"{label[:10]:<12}", end="")
        for j in range(len(labels)):
            print(f"{cm[i][j]:>10}", end="")
        print()
    print("========================================================\n")
    
    # 6. Sauvegarde du modèle
    print(f"Sauvegarde du modèle dans {model_path}...")
    joblib.dump(pipeline, model_path)
    print("Sauvegarde terminée ! Le modèle est prêt à être utilisé par l'API.")

if __name__ == "__main__":
    main()
