"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    # Verificar que todos los campos obligatorios estén presentes
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    body = request.get_json()

    # Validar campos obligatorios
    if "email" not in body or "password" not in body:
        return jsonify({"error": "Missing fields"}), 400

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Crear nuevo usuario
    new_user = User(
        email=body["email"],
        password=body["password"],
        is_active=True
    )

    # Guardar en la base de datos
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    body = request.get_json()

    # Validar campos obligatorios
    if "email" not in body or "password" not in body:
        return jsonify({"error": "Missing fields"}), 400

    # Buscar usuario por email
    user = User.query.filter_by(email=body["email"]).first()

    # Verificar si el usuario existe y la contraseña es correcta
    if not user or not user.check_password(body["password"]):
        return jsonify({"error": "Bad email or password"}), 401

    # Crear token de acceso
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user_id": user.id,
        "email": user.email
    }), 200


@api.route('/validate', methods=['GET'])
@jwt_required()
def validate_token():
    # Obtener identidad del usuario actual (del token)
    current_user_id = get_jwt_identity()

    user_id = int(current_user_id)

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active
    }), 200
