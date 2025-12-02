"""Data Encryption Module"""
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from typing import Optional

class FieldEncryption:
    """Encrypt sensitive fields in database"""
    
    def __init__(self, encryption_key: Optional[str] = None):
        """
        Initialize with encryption key
        
        Args:
            encryption_key: Base64-encoded Fernet key. If not provided, uses env variable.
        """
        if encryption_key is None:
            encryption_key = os.environ.get('FIELD_ENCRYPTION_KEY')
        
        if encryption_key is None:
            # Generate a new key (in production, this should be stored securely)
            self.key = Fernet.generate_key()
            print(f"WARNING: Generated new encryption key: {base64.urlsafe_b64encode(self.key).decode()}")
            print("Store this in FIELD_ENCRYPTION_KEY environment variable!")
        else:
            self.key = base64.urlsafe_b64decode(encryption_key)
        
        self.cipher = Fernet(self.key)
    
    def encrypt(self, plaintext: str) -> str:
        """Encrypt a string
        
        Returns:
            Base64-encoded encrypted string
        """
        if not plaintext:
            return plaintext
        
        encrypted_bytes = self.cipher.encrypt(plaintext.encode('utf-8'))
        return base64.urlsafe_b64encode(encrypted_bytes).decode('utf-8')
    
    def decrypt(self, ciphertext: str) -> str:
        """Decrypt a string
        
        Args:
            ciphertext: Base64-encoded encrypted string
        
        Returns:
            Decrypted plaintext string
        """
        if not ciphertext:
            return ciphertext
        
        try:
            encrypted_bytes = base64.urlsafe_b64decode(ciphertext)
            decrypted_bytes = self.cipher.decrypt(encrypted_bytes)
            return decrypted_bytes.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")
    
    @staticmethod
    def generate_key() -> str:
        """Generate a new encryption key
        
        Returns:
            Base64-encoded Fernet key
        """
        key = Fernet.generate_key()
        return base64.urlsafe_b64encode(key).decode('utf-8')

class PasswordBasedEncryption:
    """Derive encryption key from password (for user-specific encryption)"""
    
    @staticmethod
    def derive_key(password: str, salt: bytes = None) -> tuple[bytes, bytes]:
        """Derive encryption key from password using PBKDF2
        
        Args:
            password: User password
            salt: Salt for key derivation (generated if not provided)
        
        Returns:
            (key, salt) tuple
        """
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key, salt

# Global field encryption instance
field_encryptor = FieldEncryption()

class PIIProtector:
    """Protect Personally Identifiable Information"""
    
    SENSITIVE_FIELDS = [
        'ssn',
        'tax_id',
        'bank_account_number',
        'routing_number',
        'credit_card_number',
        'drivers_license',
        'passport_number'
    ]
    
    @staticmethod
    def encrypt_pii(data: dict) -> dict:
        """Encrypt PII fields in a dictionary
        
        Args:
            data: Dictionary that may contain PII fields
        
        Returns:
            Dictionary with PII fields encrypted
        """
        encrypted_data = data.copy()
        
        for field in PIIProtector.SENSITIVE_FIELDS:
            if field in encrypted_data and encrypted_data[field]:
                encrypted_data[field] = field_encryptor.encrypt(str(encrypted_data[field]))
                encrypted_data[f"{field}_encrypted"] = True
        
        return encrypted_data
    
    @staticmethod
    def decrypt_pii(data: dict) -> dict:
        """Decrypt PII fields in a dictionary
        
        Args:
            data: Dictionary with encrypted PII fields
        
        Returns:
            Dictionary with PII fields decrypted
        """
        decrypted_data = data.copy()
        
        for field in PIIProtector.SENSITIVE_FIELDS:
            if f"{field}_encrypted" in decrypted_data and decrypted_data.get(f"{field}_encrypted"):
                if field in decrypted_data and decrypted_data[field]:
                    decrypted_data[field] = field_encryptor.decrypt(decrypted_data[field])
                    del decrypted_data[f"{field}_encrypted"]
        
        return decrypted_data
    
    @staticmethod
    def mask_pii(value: str, field_type: str) -> str:
        """Mask PII for display (e.g., ***-**-1234 for SSN)
        
        Args:
            value: PII value to mask
            field_type: Type of PII (ssn, credit_card, etc.)
        
        Returns:
            Masked value
        """
        if not value:
            return value
        
        if field_type == 'ssn':
            # Show last 4 digits: ***-**-1234
            return f"***-**-{value[-4:]}" if len(value) >= 4 else "***"
        
        elif field_type in ['credit_card_number', 'bank_account_number']:
            # Show last 4 digits: ****1234
            return f"****{value[-4:]}" if len(value) >= 4 else "****"
        
        elif field_type == 'email':
            # Show first char and domain: j***@example.com
            if '@' in value:
                local, domain = value.split('@')
                return f"{local[0]}***@{domain}"
            return "***@***"
        
        elif field_type == 'phone':
            # Show last 4 digits: ***-***-1234
            return f"***-***-{value[-4:]}" if len(value) >= 4 else "***"
        
        else:
            # Generic masking: show first and last char
            if len(value) <= 2:
                return "***"
            return f"{value[0]}***{value[-1]}"
