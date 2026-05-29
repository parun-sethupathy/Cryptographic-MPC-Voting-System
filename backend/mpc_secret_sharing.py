import random

P = 104729  # Large prime

# Evaluate polynomial at x
def polynomial(x, coeffs):
    result = 0
    for i, coeff in enumerate(coeffs):
        result += coeff * (x ** i)
    return result % P


# Generate Shamir shares
def generate_shares(secret_vector):
    shares1 = []
    shares2 = []
    shares3 = []

    for secret in secret_vector:
        # f(x) = secret + a1*x
        a1 = random.randint(1, P-1)
        coeffs = [secret, a1]

        s1 = polynomial(1, coeffs)
        s2 = polynomial(2, coeffs)
        s3 = polynomial(3, coeffs)

        shares1.append(s1)
        shares2.append(s2)
        shares3.append(s3)

    return shares1, shares2, shares3


# Modular inverse
def mod_inverse(a, p):
    return pow(a, -1, p)


# Lagrange interpolation for reconstruction
def lagrange_interpolate(x_values, y_values):
    total = 0
    k = len(x_values)

    for i in range(k):
        xi, yi = x_values[i], y_values[i]

        numerator = 1
        denominator = 1

        for j in range(k):
            if i != j:
                xj = x_values[j]
                numerator = (numerator * (-xj)) % P
                denominator = (denominator * (xi - xj)) % P

        lagrange_coeff = numerator * mod_inverse(denominator, P)
        total = (P + total + (yi * lagrange_coeff)) % P

    return total


# Reconstruct secret vector
def reconstruct_secret(sum1, sum2, sum3):
    result = []

    for i in range(len(sum1)):
        y_values = [sum1[i], sum2[i], sum3[i]]
        x_values = [1, 2, 3]

        secret = lagrange_interpolate(x_values, y_values)
        result.append(secret)

    return result