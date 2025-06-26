FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia a solução e o projeto
COPY . .

# Roda o restore com o caminho certo
RUN dotnet restore "./ApiDespesas.csproj"

# Build
RUN dotnet build "./ApiDespesas.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "./ApiDespesas.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApiDespesas.dll"]

