import os

def create_directory_structure():
    # Define the structure
    structure = {
        'app': {
            'securenews': {
                'page.js': '// SecureNews main page',
                'layout.js': '// SecureNews layout',
                'components': {
                    'NewsCard.js': '// NewsCard component',
                    'ScanResultsSummary.js': '// ScanResultsSummary component',
                    'UserPreferences.js': '// UserPreferences component'
                },
                'utils': {
                    'urlscanApi.js': '// URLScan API utilities'
                }
            }
        }
    }

    def create_structure(base_path, structure):
        for key, value in structure.items():
            path = os.path.join(base_path, key)
            if isinstance(value, dict):
                os.makedirs(path, exist_ok=True)
                create_structure(path, value)
            else:
                with open(path, 'w') as f:
                    f.write(value)

    create_structure('.', structure)
    print("Directory structure created successfully!")

if __name__ == "__main__":
    create_directory_structure()