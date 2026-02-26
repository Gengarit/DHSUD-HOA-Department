#!/bin/bash
# Development menu for Linux/macOS

while true; do
    echo ""
    echo "=== HOA Management System - Development Menu ==="
    echo "1. Start Backend Only"
    echo "2. Start Frontend Only"
    echo "3. Start Both (Recommended)"
    echo "4. Run Database Migrations"
    echo "5. Create Django Superuser"
    echo "6. Reset Database"
    echo "7. Exit"
    echo ""
    read -p "Enter choice (1-7): " choice

    case $choice in
        1)
            echo "Starting Django Backend..."
            cd backend
            python3 manage.py runserver 0.0.0.0:8000
            ;;
        2)
            echo "Starting Vue Frontend..."
            cd frontend
            npm run dev
            ;;
        3)
            chmod +x start-hoa-system.sh
            ./start-hoa-system.sh
            ;;
        4)
            echo "Running Migrations..."
            cd backend
            python3 manage.py migrate
            echo "Done!"
            ;;
        5)
            echo "Creating Superuser..."
            cd backend
            python3 manage.py createsuperuser
            ;;
        6)
            read -p "WARNING: This will delete the database! Type 'yes' to confirm: " confirm
            if [ "$confirm" = "yes" ]; then
                cd backend
                rm -f db.sqlite3
                python3 manage.py migrate
                echo "Database reset complete!"
            fi
            ;;
        7)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice"
            ;;
    esac
done
